import { BASE_URL, get, put } from "../common";
import * as NeosUtil from "../util";
import * as NeosType from "../type";

export const apiGetFriends = async ({
  userSession,
  overrideBaseUrl,
}: {
  userSession: NeosType.UserSession.NeosUserSession;
  overrideBaseUrl?: string;
}): Promise<NeosType.Friend.NeosFriend[]> => {
  const response = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users/${userSession.userId}/friends`,
    {
      headers: NeosUtil.UserSession.getAuthHeader(userSession),
    }
  );
  return response.data;
};

export const apiAddFriend = async ({
  userSession,
  targetUserId,
  overrideBaseUrl,
}: {
  userSession: NeosType.UserSession.NeosUserSession;
  targetUserId: string;
  overrideBaseUrl?: string;
}) => {
  const response = await put(
    `${overrideBaseUrl ?? BASE_URL}api/users/${
      userSession.userId
    }/friends/${targetUserId}`,
    { id: targetUserId, friendStatus: "Accepted" },
    {
      headers: NeosUtil.UserSession.getAuthHeader(userSession),
    }
  );
  return response.data;
};
