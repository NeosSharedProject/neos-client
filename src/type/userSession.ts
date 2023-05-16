import * as NeosType from "./index";

export type NeosLoginCredential =
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
    }
  | {
      ownerId: NeosType.Id.NeosUserId;
      sessionCode: string;
      secretMachineId: string;
    };

export type NeosUserSession = {
  userId: NeosType.Id.NeosUserId;
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
