import { BASE_URL, get, put } from "../common";
import { NeosUserIdType } from "../type/id";
import { NeosUserStatusType, NeosUserType } from "../type/user";
import { NeosUserSessionType } from "../type/userSession";
import { getAuthHeader } from "../util/userSession";

export async function apiGetUser({
  userSession,
  targetUserId,
  overrideBaseUrl,
}: {
  userSession?: NeosUserSessionType;
  targetUserId: string;
  overrideBaseUrl?: string;
}): Promise<NeosUserType> {
  const response = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users/${targetUserId}`,
    userSession ? { headers: getAuthHeader(userSession) } : {}
  );
  return response.data;
}

export async function apiGetUserStatus({
  userSession,
  targetUserId,
  overrideBaseUrl,
}: {
  userSession?: NeosUserSessionType;
  targetUserId: NeosUserIdType;
  overrideBaseUrl?: string;
}): Promise<NeosUserStatusType> {
  const response = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users/${targetUserId}/status`,
    userSession ? { headers: getAuthHeader(userSession) } : {}
  );
  return response.data;
}

export async function apiPutUserStatus({
  userSession,
  status,
  overrideBaseUrl,
}: {
  userSession: NeosUserSessionType;
  status: NeosUserStatusType;
  overrideBaseUrl?: string;
}): Promise<void> {
  await put(
    `${overrideBaseUrl ?? BASE_URL}api/users/${userSession.userId}/status`,
    status,
    {
      headers: getAuthHeader(userSession),
    }
  );
}
