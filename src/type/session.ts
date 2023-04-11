import {
  NeosDateStringType,
  NeosVersionType,
  NeosSessionUrlType,
  NeosUriType,
} from "./common";
import {
  NeosMachineIdType,
  NeosOwnerIdType,
  NeosRecordIdType,
  NeosSessionIdType,
  NeosUserIdType,
} from "./id";

export type NeosSessionUserType = {
  username: string;
  userID: NeosUserIdType;
  isPresent: boolean;
  outputDevice: 2 | 3;
};

export type NeosSessionType = {
  name: string;
  correspondingWorldId: null | {
    recordId: NeosRecordIdType;
    ownerId: NeosOwnerIdType;
  };
  tags: string[];
  sessionId: NeosSessionIdType;
  normalizedSessionId: string;
  hostUserId: NeosUserIdType;
  hostMachineId: NeosMachineIdType;
  hostUsername: string;
  compatibilityHash: string;
  neosVersion: NeosVersionType;
  headlessHost: boolean;
  sessionURLs: NeosSessionUrlType[];
  sessionUsers: NeosSessionUserType[];
  thumbnail: NeosUriType;
  joinedUsers: number;
  activeUsers: number;
  totalJoinedUsers: number;
  totalActiveUsers: number;
  maxUsers: number;
  mobileFriendly: boolean;
  sessionBeginTime: NeosDateStringType;
  lastUpdate: NeosDateStringType;
  accessLevel: "FriendsOfFriends";
  hasEnded: boolean;
  isValid: boolean;
};
