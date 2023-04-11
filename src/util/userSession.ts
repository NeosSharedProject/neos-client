import { NeosUserIdType } from "../type/id";
import {
  NeosLoginCredentialType,
  NeosUserSessionType,
} from "../type/userSession";

export function getAuthHeader(userSession: NeosUserSessionType) {
  return {
    Authorization: `neos ${userSession.userId}:${userSession.token}`,
  };
}

export function isPasswordCredential(
  loginCredential: NeosLoginCredentialType
): loginCredential is
  | {
      ownerId: NeosUserIdType;
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
