import { NeosUserSessionType } from "../type/userSession";

export function getAuthHeader(userSession: NeosUserSessionType) {
  return {
    Authorization: `neos ${userSession.userId}:${userSession.token}`,
  };
}
