import { HubConnection } from "@microsoft/signalr";
import { apiConnectHub } from "../api/hub";
import { EventEmitter } from "events";
import { MessageManager } from "./messageManager";
import { Neos } from ".";
import { FriendManager } from "./friendManager";
import { parseNeosMessage } from "../util/message";
import * as NeosType from "../type";

export type EventType =
  | [
      eventName: "MessageReceived",
      listener: (message: NeosType.Message.Message) => any
    ]
  | [
      eventName: "MessagesRead",
      listener: (
        messageIds: NeosType.Id.NeosMessageId[],
        readTime: NeosType.Common.NeosDateString
      ) => any
    ]
  | [
      eventName: "MessagesUpdated",
      listener: (messages: NeosType.Message.Message[]) => any
    ]
  | [
      eventName: "FriendRequested",
      listener: (friend: NeosType.Friend.NeosFriend) => any
    ]
  | [
      eventName: "FriendOnline",
      listener: (friend: NeosType.Friend.NeosFriend) => any
    ]
  | [
      eventName: "FriendsUpdated",
      listener: (friends: NeosType.Friend.NeosFriend[]) => any
    ]
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

  async connectHub({
    userSession,
  }: {
    userSession: NeosType.UserSession.NeosUserSession;
  }) {
    this.hubConnection = await apiConnectHub({
      userSession,
      overrideBaseUrl: this.neos.overrideBaseUrl,
      overrideHubUrl: this.neos.overrideHubUrl,
    });
    this.hubConnection.on(
      "ReceiveMessage",
      (NeosMessage: NeosType.Message.NeosMessage) => {
        const message = parseNeosMessage(NeosMessage);
        this.messageManager?._addLocalMessage({
          message,
        });
        this.emit("MessageReceived", message);
      }
    );
    this.hubConnection.on(
      "MessagesRead",
      ({ ids, readTime }: NeosType.Hub.MessagesReadEventArgument) => {
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
