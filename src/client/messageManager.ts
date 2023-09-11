import { sendMessageHub, markMessageReadHub } from "../api/hub";
import {
  apiGetMessages,
  apiMarkMessageRead,
  apiSendTextMessage,
} from "../api/messages";
import { generateTextMessage } from "../util/message";
import { EventManager } from "./eventManager";
import { apiSendKFC } from "../api/messages";
import * as NeosType from "../type";

export class MessageManager {
  localMessages?: NeosType.Message.Message[];
  eventManager: EventManager;

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
  }

  _addLocalMessage({ message }: { message: NeosType.Message.Message }) {
    if (
      this.localMessages &&
      !this.localMessages.some((msg) => msg.id === message.id)
    ) {
      this.localMessages.push(message);
      this.eventManager.emit("MessagesUpdated", this.localMessages);
    }
  }

  _removeLocalMessage({
    messageId,
  }: {
    messageId: NeosType.Message.Message["id"];
  }) {
    this.localMessages = this.localMessages?.filter(
      (message) => message.id !== messageId
    );
  }

  _readLocalMessages({
    messageIds,
    readTime,
  }: {
    messageIds: NeosType.Id.NeosMessageId[];
    readTime: NeosType.Common.NeosDateString;
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
    userSession: NeosType.UserSession.NeosUserSession;
  }): Promise<void> {
    try {
      this.localMessages = await apiGetMessages({
        userSession,
        overrideBaseUrl: this.eventManager.neos.overrideBaseUrl,
      });
      this.eventManager.emit("MessagesUpdated", this.localMessages);
    } catch (e) {
      console.error(`Failed to sync messages: ${e}`);
    }
  }

  public async syncUserMessages({
    userSession,
    targetUserId,
    fromTime,
  }: {
    userSession: NeosType.UserSession.NeosUserSession;
    targetUserId: NeosType.Id.NeosUserId;
    fromTime?: Date;
  }) {
    try {
      const userMessages = await apiGetMessages({
        userSession,
        targetUserId,
        fromTime,
        overrideBaseUrl: this.eventManager.neos.overrideBaseUrl,
      });
      userMessages.forEach((message) => {
        this._addLocalMessage({ message });
      });
    } catch (e) {
      console.error(`Failed to sync user messages: ${e}`);
    }
  }

  public async sendTextMessage({
    userSession,
    targetUserId,
    message,
  }: {
    userSession: NeosType.UserSession.NeosUserSession;
    targetUserId: NeosType.Id.NeosUserId;
    message: string;
  }): Promise<NeosType.Message.TextMessage> {
    let msg: NeosType.Message.TextMessage;
    if (this.eventManager.hubConnection?.state === "Connected") {
      msg = generateTextMessage({
        targetUserId,
        senderUserId: userSession.userId,
        content: message,
      });
      this._addLocalMessage({ message: msg });
      try {
        await sendMessageHub({
          connection: this.eventManager.hubConnection,
          message: msg,
        });
      } catch (e) {
        this._removeLocalMessage({ messageId: msg.id });
        throw e;
      }
    } else {
      msg = await apiSendTextMessage({
        userSession,
        targetUserId,
        message,
        overrideBaseUrl: this.eventManager.neos.overrideBaseUrl,
      });
      this._addLocalMessage({ message: msg });
    }
    return msg;
  }

  public async sendKFC({
    userSession,
    targetUserId,
    amount,
    comment,
    totp,
  }: {
    userSession: NeosType.UserSession.NeosUserSession;
    targetUserId: NeosType.Id.NeosUserId;
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
    userSession: NeosType.UserSession.NeosUserSession;
    messageIds: NeosType.Id.NeosMessageId[];
  }): Promise<NeosType.Id.NeosMessageId[]> {
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
