import { BASE_URL, httpDelete, post } from "../common";
import {
  NeosLoginCredentialType,
  NeosUserSessionType,
} from "../type/userSession";
import { getAuthHeader } from "../util/userSession";

export async function apiPostUserSession({
  loginCredential,
  overrideBaseUrl,
}: {
  loginCredential: NeosLoginCredentialType;
  overrideBaseUrl?: string;
}): Promise<NeosUserSessionType> {
  const response = await post(
    `${overrideBaseUrl ?? BASE_URL}api/userSessions`,
    loginCredential
  );
  if (response.status !== 200) {
    throw new Error("postUserSession error");
  }
  return response.data;
}

export async function apiDeleteUserSession({
  userSession,
  overrideBaseUrl,
}: {
  userSession: NeosUserSessionType;
  overrideBaseUrl?: string;
}) {
  await httpDelete(
    `${overrideBaseUrl ?? BASE_URL}api/userSessions/${userSession.userId}/${
      userSession.token
    }`,
    {
      headers: getAuthHeader(userSession),
    }
  );
}
