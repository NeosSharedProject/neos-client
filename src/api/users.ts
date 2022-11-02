import { BASE_URL, get } from "../common";
import { NeosUserType } from "../type/user";
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
