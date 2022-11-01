import { BASE_URL, get, put } from "../common";
import { NeosFriendType } from "../type/friend";
import { NeosUserSessionType } from "../type/userSession";
import { getAuthHeader } from "../util/userSession";

export async function getFriends({
  userSession,
}: {
  userSession: NeosUserSessionType;
}): Promise<NeosFriendType[]> {
  const response = await get(
    `${BASE_URL}api/users/${userSession.userId}/friends`,
    {
      headers: getAuthHeader(userSession),
    }
  );
  return response.data;
}

export async function addFriend({
  userSession,
  targetUserId,
}: {
  userSession: NeosUserSessionType;
  targetUserId: string;
}) {
  const response = await put(
    `${BASE_URL}api/users/${userSession.userId}/friends/${targetUserId}`,
    { id: targetUserId, friendStatus: "Accepted" },
    {
      headers: getAuthHeader(userSession),
    }
  );
  return response.data;
}
