import * as NeosType from "./";

export type ReceiveMessageEventArgument = NeosType.Message.Message;

export type MessagesReadEventArgument = {
  recipientId: NeosType.Id.NeosUserId;
  readTime: NeosType.Common.NeosDateString;
  ids: NeosType.Id.NeosMessageId[];
};

export type EventCallbackList = (
  | {
      methodName: "ReceiveMessage";
      callback: (data: ReceiveMessageEventArgument) => unknown;
    }
  | {
      methodName: "MessagesRead";
      callback: (data: MessagesReadEventArgument) => unknown;
    }
)[];
