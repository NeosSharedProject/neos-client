import {
  BASE_URL,
  get,
  post,
  getAuthHeader,
  Credential,
  uuidv4,
} from "../common";

export async function getMessages({
  credential,
  targetUserId,
}: {
  credential: Credential;
  targetUserId?: string;
}) {
  const res = await get(
    `${BASE_URL}api/users/${credential.userId}/messages?${
      targetUserId ? `user=${targetUserId}&` : ""
    }`,
    getAuthHeader(credential)
  );
  return res.data;
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
