import { sendMessageHub, markMessageReadHub } from "../api/hub";
import {
  apiGetMessages,
  apiMarkMessageRead,
  apiSendTextMessage,
} from "../api/messages";
import { NeosDateStringType } from "../type/common";
import { NeosMessageIdType, NeosUserIdType } from "../type/id";
import { MessageType, TextMessageType } from "../type/message";
import { NeosUserSessionType } from "../type/userSession";
import { generateTextMessage } from "../util/message";
import { EventManager } from "./eventManager";
import { apiSendKFC } from "../api/messages";

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
    this.localMessages = await apiGetMessages({
      userSession,
      overrideBaseUrl: this.eventManager.neos.overrideBaseUrl,
    });
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
    const userMessages = await apiGetMessages({
      userSession,
      targetUserId,
      fromTime,
      overrideBaseUrl: this.eventManager.neos.overrideBaseUrl,
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
      await sendMessageHub({
        connection: this.eventManager.hubConnection,
        message: msg,
      });
    } else {
      msg = await apiSendTextMessage({
        userSession,
        targetUserId,
        message,
        overrideBaseUrl: this.eventManager.neos.overrideBaseUrl,
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
    await apiSendKFC({
      userSession: userSession,
      targetUserId,
      amount,
      comment,
      totp,
      overrideBaseUrl: this.eventManager.neos.overrideBaseUrl,
    });
    const fromTime = new Date();
    fromTime.setDate(fromTime.getDate() - 1);
    await this.syncUserMessages({
      userSession,
      targetUserId,
      fromTime,
    });
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
      return await apiMarkMessageRead({
        userSession,
        messageIds,
        overrideBaseUrl: this.eventManager.neos.overrideBaseUrl,
      });
    }
  }
}
