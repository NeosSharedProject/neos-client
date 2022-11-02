import {
  CreditTransferMessageContentType,
  MessageType,
  NeosCreditTransferMessageType,
  NeosMessageType,
  NeosObjectMessageType,
  NeosSessionInviteMessageType,
  NeosSoundMessageType,
  ObjectMessageContentType,
  SessionInviteMessageContentType,
  SoundMessageContentType,
} from "../type/message";

function safeJsonParse<T>(str: string): T | string {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export function getObjectMessageContent(
  message: NeosObjectMessageType
): ObjectMessageContentType {
  return safeJsonParse(message.content) as ObjectMessageContentType;
}

export function getCreditTransferMessageContent(
  message: NeosCreditTransferMessageType
): CreditTransferMessageContentType {
  return safeJsonParse(message.content) as CreditTransferMessageContentType;
}

export function getSessionInviteMessageContent(
  message: NeosSessionInviteMessageType
): SessionInviteMessageContentType {
  return safeJsonParse(message.content) as SessionInviteMessageContentType;
}

export function getSoundMessageContent(
  message: NeosSoundMessageType
): SoundMessageContentType {
  return safeJsonParse(message.content) as SoundMessageContentType;
}

export function parseNeosMessage(message: NeosMessageType): MessageType {
  switch (message.messageType) {
    case "Text":
      return message;
    case "Object":
      return {
        ...message,
        content: getObjectMessageContent(message),
      };
    case "CreditTransfer":
      return {
        ...message,
        content: getCreditTransferMessageContent(message),
      };
    case "SessionInvite":
      return {
        ...message,
        content: getSessionInviteMessageContent(message),
      };
    case "Sound":
      return { ...message, content: getSoundMessageContent(message) };
    default:
      throw new Error(`unknown messageType. message=${message}`);
  }
}
