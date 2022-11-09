import { sendMessage, markMessageRead as markMessageReadHub } from "../api/hub";
import { getMessages, markMessageRead, sendTextMessage } from "../api/messages";
import { NeosDateStringType } from "../type/common";
import { NeosMessageIdType, NeosUserIdType } from "../type/id";
import { MessageType, TextMessageType } from "../type/message";
import { NeosUserSessionType } from "../type/userSession";
import { generateTextMessage } from "../util/message";
import { EventManager } from "./eventManager";

export class MessageManager {
  localMessages?: MessageType[];
  eventManager: EventManager;

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
  }

  _addLocalMessage({ message }: { message: MessageType }) {
    if (
      this.localMessages &&
      !this.localMessages.some((msg) => msg.id === message.id)
    ) {
      this.localMessages.push(message);
      this.eventManager.emit("MessagesUpdated", this.localMessages);
    }
  }

  _readLocalMessages({
    messageIds,
    readTime,
  }: {
    messageIds: NeosMessageIdType[];
    readTime: NeosDateStringType;
  }) {
    this.localMessages = this.localMessages?.map((message) =>
      messageIds.some((id) => id === message.id)
        ? { ...message, readTime }
        : message
    );
    if (this.localMessages) {
      this.eventManager.emit("MessagesUpdated", this.localMessages);
    }
  }

  public async syncMessages({
    userSession,
  }: {
    userSession: NeosUserSessionType;
  }): Promise<void> {
    this.localMessages = await getMessages({ userSession });
    this.eventManager.emit("MessagesUpdated", this.localMessages);
  }

  public async sendTextMessage({
    userSession,
    targetUserId,
    message,
  }: {
    userSession: NeosUserSessionType;
    targetUserId: NeosUserIdType;
    message: string;
  }): Promise<TextMessageType> {
    let msg: TextMessageType;
    if (this.eventManager.hubConnection) {
      msg = generateTextMessage({
        targetUserId,
        senderUserId: userSession.userId,
        content: message,
      });
      await sendMessage({
        connection: this.eventManager.hubConnection,
        message: msg,
      });
    } else {
      msg = await sendTextMessage({
        userSession,
        targetUserId,
        message,
      });
    }
    this._addLocalMessage({ message: msg });
    return msg;
  }

  public async readMessages({
    userSession,
    messageIds,
  }: {
    userSession: NeosUserSessionType;
    messageIds: NeosMessageIdType[];
  }): Promise<NeosMessageIdType[]> {
    const readTime = new Date().toISOString();
    this._readLocalMessages({ messageIds, readTime });
    this.eventManager.emit("MessagesRead", messageIds, readTime);
    if (this.eventManager.hubConnection) {
      await markMessageReadHub({
        connection: this.eventManager.hubConnection,
        markReadBatch: {
          recipientId: userSession.userId,
          ids: messageIds,
          readTime: new Date().toISOString(),
        },
      });
      return messageIds;
    } else {
      return await markMessageRead({ userSession, messageIds });
    }
  }
}
