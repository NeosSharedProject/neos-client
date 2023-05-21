import { BASE_URL, get } from "../common";
import * as NeosUtil from "../util";

import * as NeosType from "../type";

export const apiGetSessions = async ({
  userSession,
  overrideBaseUrl,
}: {
  userSession?: NeosType.UserSession.NeosUserSession;
  overrideBaseUrl?: string;
}): Promise<NeosType.Session.NeosSession[]> => {
  const response = await get(
    `${overrideBaseUrl ?? BASE_URL}api/sessions`,
    userSession
      ? { headers: NeosUtil.UserSession.getAuthHeader(userSession) }
      : {}
  );
  return response.data;
};
