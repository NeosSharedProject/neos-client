import { BASE_URL, get, Credential, getAuthHeader, put } from "../common";

export async function getFriends({ credential }: { credential: Credential }) {
  const res = await get(
    `${BASE_URL}api/users/${credential.userId}/friends`,
    getAuthHeader(credential)
  );
  return res.data;
}

export async function addFriend({
  credential,
  targetUserId,
}: {
  credential: Credential;
  targetUserId: string;
}) {
  const response = await put(
    `${BASE_URL}api/users/${credential.userId}/friends/${targetUserId}`,
    { id: targetUserId, friendStatus: "Accepted" },
    getAuthHeader(credential)
  );
  return response;
}
