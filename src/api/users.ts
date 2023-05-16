import { BASE_URL, get, put } from "../common";
import * as NeosUtil from "../util";
import * as NeosType from "../type";

export async function apiGetUser({
  userSession,
  targetUserId,
  overrideBaseUrl,
}: {
  userSession?: NeosType.UserSession.NeosUserSession;
  targetUserId: string;
  overrideBaseUrl?: string;
}): Promise<NeosType.User.NeosUser> {
  const response = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users/${targetUserId}`,
    userSession
      ? { headers: NeosUtil.UserSession.getAuthHeader(userSession) }
      : {}
  );
  return response.data;
}

export async function apiFindUsers({
  userSession,
  keyword,
  overrideBaseUrl,
}: {
  userSession?: NeosType.UserSession.NeosUserSession;
  keyword: string;
  overrideBaseUrl?: string;
}): Promise<NeosType.User.NeosUser[]> {
  const response = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users?name=${keyword}`,
    userSession
      ? { headers: NeosUtil.UserSession.getAuthHeader(userSession) }
      : {}
  );
  return response.data;
}

export async function apiGetUserStatus({
  userSession,
  targetUserId,
  overrideBaseUrl,
}: {
  userSession?: NeosType.UserSession.NeosUserSession;
  targetUserId: NeosType.Id.NeosUserId;
  overrideBaseUrl?: string;
}): Promise<NeosType.User.NeosUserStatus> {
  const response = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users/${targetUserId}/status`,
    userSession
      ? { headers: NeosUtil.UserSession.getAuthHeader(userSession) }
      : {}
  );
  return response.data;
}

export async function apiPutUserStatus({
  userSession,
  status,
  overrideBaseUrl,
}: {
  userSession: NeosType.UserSession.NeosUserSession;
  status: NeosType.User.NeosUserStatus;
  overrideBaseUrl?: string;
}): Promise<void> {
  await put(
    `${overrideBaseUrl ?? BASE_URL}api/users/${userSession.userId}/status`,
    status,
    {
      headers: NeosUtil.UserSession.getAuthHeader(userSession),
    }
  );
}
