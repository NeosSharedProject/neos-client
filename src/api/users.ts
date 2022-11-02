import { BASE_URL, get, put } from "../common";
import { NeosUserIdType } from "../type/id";
import { NeosUserStatusType, NeosUserType } from "../type/user";
import { NeosUserSessionType } from "../type/userSession";
import { getAuthHeader } from "../util/userSession";

export async function getUser({
  userSession,
  targetUserId,
}: {
  userSession?: NeosUserSessionType;
  targetUserId: string;
}): Promise<NeosUserType> {
  const response = await get(
    `${BASE_URL}api/users/${targetUserId}`,
    userSession ? { headers: getAuthHeader(userSession) } : {}
  );
  return response.data;
}

export async function getUserStatus({
  userSession,
  targetUserId,
}: {
  userSession?: NeosUserSessionType;
  targetUserId: NeosUserIdType;
}): Promise<NeosUserStatusType> {
  const response = await get(
    `${BASE_URL}api/users/${targetUserId}/status`,
    userSession ? { headers: getAuthHeader(userSession) } : {}
  );
  return response.data;
}

export async function putUserStatus({
  userSession,
  status,
}: {
  userSession: NeosUserSessionType;
  status: NeosUserStatusType;
}): Promise<void> {
  await put(`${BASE_URL}api/users/${userSession.userId}/status`, status, {
    headers: getAuthHeader(userSession),
  });
}
