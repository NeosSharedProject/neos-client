import { BASE_URL, get, put } from "../common";
import { NeosFriendType } from "../type/friend";
import { NeosUserSessionType } from "../type/userSession";
import { getAuthHeader } from "../util/userSession";

export async function apiGetFriends({
  userSession,
  overrideBaseUrl,
}: {
  userSession: NeosUserSessionType;
  overrideBaseUrl?: string;
}): Promise<NeosFriendType[]> {
  const response = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users/${userSession.userId}/friends`,
    {
      headers: getAuthHeader(userSession),
    }
  );
  return response.data;
}

export async function apiAddFriend({
  userSession,
  targetUserId,
  overrideBaseUrl,
}: {
  userSession: NeosUserSessionType;
  targetUserId: string;
  overrideBaseUrl?: string;
}) {
  const response = await put(
    `${overrideBaseUrl ?? BASE_URL}api/users/${
      userSession.userId
    }/friends/${targetUserId}`,
    { id: targetUserId, friendStatus: "Accepted" },
    {
      headers: getAuthHeader(userSession),
    }
  );
  return response.data;
}
