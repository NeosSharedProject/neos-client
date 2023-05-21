import * as NeosType from "../type";

export const getAuthHeader = (
  userSession: NeosType.UserSession.NeosUserSession
) => {
  return {
    Authorization: `neos ${userSession.userId}:${userSession.token}`,
  };
};

export const isPasswordCredential = (
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
    } => {
  return "password" in loginCredential;
};
