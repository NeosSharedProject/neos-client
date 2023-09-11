import { uuidv4 } from "../common";
import * as NeosType from "../type";

const safeJsonParse = <T>(str: string): T | string => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
};

export const getObjectMessageContent = (
  message: NeosType.Message.NeosObjectMessage
): NeosType.Message.ObjectMessageContent => {
  return safeJsonParse(
    message.content
  ) as NeosType.Message.ObjectMessageContent;
};

export const getCreditTransferMessageContent = (
  message: NeosType.Message.NeosCreditTransferMessage
): NeosType.Message.CreditTransferMessageContent => {
  return safeJsonParse(
    message.content
  ) as NeosType.Message.CreditTransferMessageContent;
};

export const getSessionInviteMessageContent = (
  message: NeosType.Message.NeosSessionInviteMessage
): NeosType.Message.SessionInviteMessageContent => {
  return safeJsonParse(
    message.content
  ) as NeosType.Message.SessionInviteMessageContent;
};

export const getSoundMessageContent = (
  message: NeosType.Message.NeosSoundMessage
): NeosType.Message.SoundMessageContent => {
  return safeJsonParse(message.content) as NeosType.Message.SoundMessageContent;
};

export const parseNeosMessage = (
  message: NeosType.Message.NeosMessage
): NeosType.Message.Message => {
  const messageType = message.messageType;
  switch (messageType) {
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
    // case "SugarCubes":
    //   return message;
    default:
      console.error(`unknown messageType. messageType=${messageType}`);
      return message;
  }
};

export const generateTextMessage = ({
  targetUserId,
  senderUserId,
  content,
}: {
  targetUserId: NeosType.Id.NeosUserId;
  senderUserId: NeosType.Id.NeosUserId;
  content: string;
}): NeosType.Message.TextMessage => {
  return {
    id: `MSG-${uuidv4()}`,
    senderId: senderUserId,
    recipientId: targetUserId,
    messageType: "Text",
    content,
    sendTime: new Date().toISOString(),
    lastUpdateTime: new Date().toISOString(),
    readTime: null,
    ownerId: senderUserId,
  };
};
