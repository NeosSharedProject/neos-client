import { BASE_URL, httpDelete, post } from "../common";
import * as NeosUtil from "../util";

import * as NeosType from "../type";

export async function apiPostUserSession({
  loginCredential,
  overrideBaseUrl,
}: {
  loginCredential: NeosType.UserSession.NeosLoginCredential;
  overrideBaseUrl?: string;
}): Promise<NeosType.UserSession.NeosUserSession> {
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
  userSession: NeosType.UserSession.NeosUserSession;
  overrideBaseUrl?: string;
}) {
  await httpDelete(
    `${overrideBaseUrl ?? BASE_URL}api/userSessions/${userSession.userId}/${
      userSession.token
    }`,
    {
      headers: NeosUtil.UserSession.getAuthHeader(userSession),
    }
  );
}
