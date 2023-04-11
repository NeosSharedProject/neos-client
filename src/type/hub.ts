import { NeosDateStringType } from "./common";
import { NeosMessageIdType, NeosUserIdType } from "./id";
import { MessageType } from "./message";

export type ReceiveMessageEventArgumentType = MessageType;

export type MessagesReadEventArgumentType = {
  recipientId: NeosUserIdType;
  readTime: NeosDateStringType;
  ids: NeosMessageIdType[];
};

export type EventCallbackListType = (
  | {
      methodName: "ReceiveMessage";
      callback: (data: ReceiveMessageEventArgumentType) => any;
    }
  | {
      methodName: "MessagesRead";
      callback: (data: MessagesReadEventArgumentType) => any;
    }
)[];
