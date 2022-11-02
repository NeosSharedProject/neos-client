import { getMessages, markMessageRead, sendTextMessage } from "../api/messages";
import { NeosDateStringType } from "../type/common";
import { NeosMessageIdType, NeosUserIdType } from "../type/id";
import { MessageType, TextMessageType } from "../type/message";
import { NeosUserSessionType } from "../type/userSession";
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
  }

  public async syncMessages({
    userSession,
  }: {
    userSession: NeosUserSessionType;
  }): Promise<void> {
    this.localMessages = await getMessages({ userSession });
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
    const msg = await sendTextMessage({
      userSession,
      targetUserId,
      message,
    });
    this._addLocalMessage({ message: msg });
    this.eventManager.emit("MessageSent", msg);
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
    return await markMessageRead({ userSession, messageIds });
  }
}
