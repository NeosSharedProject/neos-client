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
import { NeosFriendType } from "../type/friend";
import { Neos } from ".";
import { FriendManager } from "./friendManager";

export type EventType =
  | [eventName: "MessageReceived", listener: (message: MessageType) => any]
  | [
      eventName: "MessagesRead",
      listener: (
        messageIds: NeosMessageIdType[],
        readTime: NeosDateStringType
      ) => any
    ]
  | [eventName: "MessagesUpdated", listener: (messages: MessageType[]) => any]
  | [eventName: "FriendRequested", listener: (friend: NeosFriendType) => any]
  | [eventName: "FriendOnline", listener: (friend: NeosFriendType) => any]
  | [eventName: "FriendsUpdated", listener: (friends: NeosFriendType[]) => any]
  | [eventName: "Login", listener: () => any]
  | [eventName: "Logout", listener: () => any];

export class EventManager extends EventEmitter {
  neos: Neos;
  hubConnection?: HubConnection;
  messageManager?: MessageManager;
  friendManager?: FriendManager;
  updateInterval: NodeJS.Timer | undefined;

  constructor(neos: Neos, option: { messageSync: boolean }) {
    super();
    this.neos = neos;
    if (option.messageSync) {
      this.messageManager = new MessageManager(this);
      this.friendManager = new FriendManager(this);
    }
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

  async initSync() {
    if (this.neos.userSession) {
      Promise.all([
        this.messageManager?.syncMessages({
          userSession: this.neos.userSession,
        }),
        this.friendManager?.syncFriends({
          userSession: this.neos.userSession,
        }),
      ]);
    }
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(async () => {
      await this.updateSync();
    }, 3000);
  }

  async updateSync() {
    if (this.neos.userSession) {
      await Promise.all([
        this.friendManager?.syncFriends({ userSession: this.neos.userSession }),
      ]);
    }
  }

  async close() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    await this.hubConnection?.stop();
  }
}
