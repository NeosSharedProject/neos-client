import {
  BASE_URL,
  get,
  post,
  getAuthHeader,
  Credential,
  uuidv4,
  patch,
} from "../common";
import { NeosMessageType } from "../type/message";
import { parseNeosMessage } from "../util/message";

export async function getMessages({
  credential,
  targetUserId,
  unReadOnly = false,
  fromTime,
}: {
  credential: Credential;
  targetUserId?: string;
  unReadOnly?: boolean;
  fromTime?: Date;
}) {
  const res = await get(
    `${BASE_URL}api/users/${credential.userId}/messages?${
      targetUserId ? `user=${targetUserId}&` : ""
    }${unReadOnly ? "unread=true&" : ""}${
      fromTime ? `fromTime=${fromTime?.toUTCString()}&` : ""
    }`,
    getAuthHeader(credential)
  );
  return res.data.map((message: NeosMessageType) => parseNeosMessage(message));
}

export async function sendTextMessage({
  credential,
  targetUserId,
  message,
}: {
  credential: Credential;
  targetUserId: string;
  message: string;
}) {
  return await post(
    `${BASE_URL}api/users/${targetUserId}/messages`,
    {
      id: `MSG-${uuidv4()}`,
      senderId: credential.userId,
      recipientId: targetUserId,
      messageType: "Text",
      content: message,
      sendTime: new Date().toISOString(),
      lastUpdateTime: new Date().toISOString(),
      readTime: null,
      ownerId: credential.userId,
    },
    getAuthHeader(credential)
  );
}

export async function markMessageRead({
  messageIds,
  credential,
}: {
  messageIds: string[];
  credential: Credential;
}) {
  return await patch(
    `${BASE_URL}api/users/${credential.userId}/messages/`,
    messageIds,
    getAuthHeader(credential)
  );
}

export async function sendKFC({
  credential,
  targetUserId,
  amount,
  comment,
}: {
  credential: Credential;
  targetUserId: string;
  amount: number;
  comment?: string;
}) {
  return await post(
    `${BASE_URL}api/transactions/KFC`,
    {
      token: "KFC",
      fromUserId: credential.userId,
      toUserId: targetUserId,
      amount,
      comment,
      transactionType: "User2User",
      anonymous: false,
    },
    getAuthHeader(credential)
  );
}
