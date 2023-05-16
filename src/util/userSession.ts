import * as NeosType from "../type";

export function getAuthHeader(
  userSession: NeosType.UserSession.NeosUserSession
) {
  return {
    Authorization: `neos ${userSession.userId}:${userSession.token}`,
  };
}

export function isPasswordCredential(
  loginCredential: NeosType.UserSession.NeosLoginCredential
): loginCredential is
  | {
      ownerId: NeosType.Id.NeosUserId;
      password: string;
      rememberMe?: boolean;
      secretMachineId?: string;
    }
  | {
      username: string;
      password: string;
      rememberMe?: boolean;
      secretMachineId?: string;
    }
  | {
      email: string;
      password: string;
      rememberMe?: boolean;
      secretMachineId?: string;
    } {
  return "password" in loginCredential;
}
