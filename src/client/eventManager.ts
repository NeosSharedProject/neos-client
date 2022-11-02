import { HubConnection } from "@microsoft/signalr";
import { NeosUserSessionType } from "../type/userSession";
import { connectHub } from "../api/hub";
import { EventEmitter } from "events";
import { MessageType } from "../type/message";
import { NeosMessageIdType } from "../type/id";
import { NeosDateStringType } from "../type/common";
import {
  MessagesReadEventArgumentType,
  ReceiveMessageEventArgumentType,
} from "../type/hub";
import { MessageManager } from "./messageManager";

export type EventType =
  | [eventName: "MessageReceived", listener: (message: MessageType) => any]
  | [
      eventName: "MessagesRead",
      listener: (
        messageIds: NeosMessageIdType[],
        readTime: NeosDateStringType
      ) => any
    ]
  | [eventName: "MessageSent", listener: (message: MessageType) => any];

export class EventManager extends EventEmitter {
  hubConnection?: HubConnection;
  messageManager?: MessageManager;

  constructor(option: { messageSync: boolean }) {
    super();
    if (option.messageSync) {
      this.messageManager = new MessageManager(this);
    }
  }

  override on(...[eventName, listener]: EventType): this {
    super.on(eventName, listener);
    return this;
  }

  override emit(
    eventName: EventType[0],
    ...args: Parameters<EventType[1]> //TODO ここの型定義を直したい。eventNameによってargsが決まるようにしたい。
  ): boolean {
    return super.emit(eventName, ...args);
  }

  async connectHub({ userSession }: { userSession: NeosUserSessionType }) {
    this.hubConnection = await connectHub({
      userSession,
    });
    this.hubConnection.on(
      "ReceiveMessage",
      (message: ReceiveMessageEventArgumentType) => {
        this.messageManager?._addLocalMessage({ message });
        this.emit("MessageReceived", message);
      }
    );
    this.hubConnection.on(
      "MessagesRead",
      ({ ids, readTime }: MessagesReadEventArgumentType) => {
        this.messageManager?._readLocalMessages({ messageIds: ids, readTime });
        this.emit("MessagesRead", ids, readTime);
      }
    );
  }

  async close() {
    await this.hubConnection?.stop();
  }
}
