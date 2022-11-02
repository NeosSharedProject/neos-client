import { BASE_URL, httpDelete, post } from "../common";
import {
  NeosLoginCredentialType,
  NeosUserSessionType,
} from "../type/userSession";
import { getAuthHeader } from "../util/userSession";

export async function postUserSession({
  loginCredential,
}: {
  loginCredential: NeosLoginCredentialType;
}): Promise<NeosUserSessionType> {
  const response = await post(`${BASE_URL}api/userSessions`, loginCredential);
  if (response.status !== 200) {
    throw new Error("postUserSession error");
  }
  return response.data;
}

export async function deleteUserSession({
  userSession,
}: {
  userSession: NeosUserSessionType;
}) {
  await httpDelete(
    `${BASE_URL}api/userSessions/${userSession.userId}/${userSession.token}`,
    {
      headers: getAuthHeader(userSession),
    }
  );
}
