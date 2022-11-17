import { sendMessage, markMessageRead as markMessageReadHub } from "../api/hub";
import { getMessages, markMessageRead, sendTextMessage } from "../api/messages";
import { NeosDateStringType } from "../type/common";
import { NeosMessageIdType, NeosUserIdType } from "../type/id";
import { MessageType, TextMessageType } from "../type/message";
import { NeosUserSessionType } from "../type/userSession";
import { generateTextMessage } from "../util/message";
import { EventManager } from "./eventManager";
import { sendKFC } from "../api/messages";

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

  public async syncUserMessages({
    userSession,
    targetUserId,
    fromTime,
  }: {
    userSession: NeosUserSessionType;
    targetUserId: NeosUserIdType;
    fromTime?: Date;
  }) {
    const userMessages = await getMessages({
      userSession,
      targetUserId,
      fromTime,
    });
    userMessages.forEach((message) => {
      this._addLocalMessage({ message });
    });
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

  public async sendKFC({
    userSession,
    targetUserId,
    amount,
    comment,
    totp,
  }: {
    userSession: NeosUserSessionType;
    targetUserId: NeosUserIdType;
    amount: number;
    comment?: string;
    totp?: string;
  }) {
    await sendKFC({
      userSession: userSession,
      targetUserId,
      amount,
      comment,
      totp,
    });
    const fromTime = new Date();
    fromTime.setDate(fromTime.getDate() - 1);
    await this.syncUserMessages({ userSession, targetUserId, fromTime });
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
