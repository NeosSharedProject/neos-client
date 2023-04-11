import { BASE_URL, get, post, uuidv4, patch } from "../common";
import { NeosMessageIdType, NeosUserIdType } from "../type/id";
import { MessageType, NeosMessageType, TextMessageType } from "../type/message";
import { NeosUserSessionType } from "../type/userSession";
import { generateTextMessage, parseNeosMessage } from "../util/message";
import { getAuthHeader } from "../util/userSession";

export async function apiGetMessages({
  userSession,
  targetUserId,
  unReadOnly = false,
  fromTime,
  overrideBaseUrl,
}: {
  userSession: NeosUserSessionType;
  targetUserId?: NeosUserIdType;
  unReadOnly?: boolean;
  fromTime?: Date;
  overrideBaseUrl?: string;
}): Promise<MessageType[]> {
  const res = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users/${userSession.userId}/messages?${
      targetUserId ? `user=${targetUserId}&` : ""
    }${unReadOnly ? "unread=true&" : ""}${
      fromTime ? `fromTime=${fromTime?.toUTCString()}&` : ""
    }`,
    { headers: getAuthHeader(userSession) }
  );
  return res.data.map((message: NeosMessageType) => parseNeosMessage(message));
}

export async function apiSendTextMessage({
  userSession,
  targetUserId,
  message,
  overrideBaseUrl,
}: {
  userSession: NeosUserSessionType;
  targetUserId: NeosUserIdType;
  message: string;
  overrideBaseUrl?: string;
}): Promise<TextMessageType> {
  const body = generateTextMessage({
    targetUserId,
    senderUserId: userSession.userId,
    content: message,
  });
  await post(
    `${overrideBaseUrl ?? BASE_URL}api/users/${targetUserId}/messages`,
    body,
    {
      headers: getAuthHeader(userSession),
    }
  );
  return body;
}

export async function apiMarkMessageRead({
  messageIds,
  userSession,
  overrideBaseUrl,
}: {
  messageIds: NeosMessageIdType[];
  userSession: NeosUserSessionType;
  overrideBaseUrl?: string;
}): Promise<NeosMessageIdType[]> {
  await patch(
    `${overrideBaseUrl ?? BASE_URL}api/users/${userSession.userId}/messages/`,
    messageIds,
    { headers: getAuthHeader(userSession) }
  );
  return messageIds;
}

export async function apiSendKFC({
  userSession,
  targetUserId,
  amount,
  comment,
  totp,
  overrideBaseUrl,
}: {
  userSession: NeosUserSessionType;
  targetUserId: string;
  amount: number;
  comment?: string;
  totp?: string;
  overrideBaseUrl?: string;
}) {
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
    { headers: { ...getAuthHeader(userSession), TOTP: totp } }
  );
}
