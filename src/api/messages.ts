import { BASE_URL, get, post, uuidv4, patch } from "../common";
import { generateTextMessage, parseNeosMessage } from "../util/message";
import * as NeosUtil from "../util";
import * as NeosType from "../type";

export const apiGetMessages = async ({
  userSession,
  targetUserId,
  unReadOnly = false,
  fromTime,
  overrideBaseUrl,
}: {
  userSession: NeosType.UserSession.NeosUserSession;
  targetUserId?: NeosType.Id.NeosUserId;
  unReadOnly?: boolean;
  fromTime?: Date;
  overrideBaseUrl?: string;
}): Promise<NeosType.Message.Message[]> => {
  const res = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users/${userSession.userId}/messages?${
      targetUserId ? `user=${targetUserId}&` : ""
    }${unReadOnly ? "unread=true&" : ""}${
      fromTime ? `fromTime=${fromTime?.toUTCString()}&` : ""
    }`,
    { headers: NeosUtil.UserSession.getAuthHeader(userSession) }
  );
  return res.data.map((message: NeosType.Message.NeosMessage) =>
    parseNeosMessage(message)
  );
};

export const apiSendTextMessage = async ({
  userSession,
  targetUserId,
  message,
  overrideBaseUrl,
}: {
  userSession: NeosType.UserSession.NeosUserSession;
  targetUserId: NeosType.Id.NeosUserId;
  message: string;
  overrideBaseUrl?: string;
}): Promise<NeosType.Message.TextMessage> => {
  const body = generateTextMessage({
    targetUserId,
    senderUserId: userSession.userId,
    content: message,
  });
  await post(
    `${overrideBaseUrl ?? BASE_URL}api/users/${targetUserId}/messages`,
    body,
    {
      headers: NeosUtil.UserSession.getAuthHeader(userSession),
    }
  );
  return body;
};

export const apiMarkMessageRead = async ({
  messageIds,
  userSession,
  overrideBaseUrl,
}: {
  messageIds: NeosType.Id.NeosMessageId[];
  userSession: NeosType.UserSession.NeosUserSession;
  overrideBaseUrl?: string;
}): Promise<NeosType.Id.NeosMessageId[]> => {
  await patch(
    `${overrideBaseUrl ?? BASE_URL}api/users/${userSession.userId}/messages/`,
    messageIds,
    { headers: NeosUtil.UserSession.getAuthHeader(userSession) }
  );
  return messageIds;
};

export const apiSendKFC = async ({
  userSession,
  targetUserId,
  amount,
  comment,
  totp,
  overrideBaseUrl,
}: {
  userSession: NeosType.UserSession.NeosUserSession;
  targetUserId: string;
  amount: number;
  comment?: string;
  totp?: string;
  overrideBaseUrl?: string;
}) => {
  return await post(
    `${overrideBaseUrl ?? BASE_URL}api/transactions/KFC`,
    {
      token: "KFC",
      fromUserId: userSession.userId,
      toUserId: targetUserId,
      amount,
      comment,
      transactionType: "User2User",
      anonymous: false,
    },
    {
      headers: {
        ...NeosUtil.UserSession.getAuthHeader(userSession),
        TOTP: totp,
      },
    }
  );
};
