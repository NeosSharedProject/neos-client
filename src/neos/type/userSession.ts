import { NeosUserIdType } from "./id";

export type NeosLoginCredentialType =
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
    }
  | {
      ownerId: NeosUserIdType;
      sessionCode: string;
      secretMachineId: string;
    };

export type NeosUserSessionType = {
  userId: NeosUserIdType;
  token: string;
  created: string;
  expire: string;
  rememberMe: boolean;
  secretMachineId: string;
  sourceIP: string;
  partitionKey: string;
  rowKey: string;
  timespamp: string;
  eTag: string;
};
