import * as NeosType from "./index";

export type NeosSessionUser = {
  username: string;
  userID: NeosType.Id.NeosUserId;
  isPresent: boolean;
  outputDevice: 2 | 3;
};

export type NeosSession = {
  name: string;
  correspondingWorldId: null | {
    recordId: NeosType.Id.NeosRecordId;
    ownerId: NeosType.Id.NeosOwnerId;
  };
  tags: string[];
  sessionId: NeosType.Id.NeosSessionId;
  normalizedSessionId: string;
  hostUserId: NeosType.Id.NeosUserId;
  hostMachineId: NeosType.Id.NeosMachineId;
  hostUsername: string;
  compatibilityHash: string;
  neosVersion: NeosType.Common.NeosVersion;
  headlessHost: boolean;
  sessionURLs: NeosType.Common.NeosSessionUrl[];
  sessionUsers: NeosSessionUser[];
  thumbnail: NeosType.Common.NeosUri;
  joinedUsers: number;
  activeUsers: number;
  totalJoinedUsers: number;
  totalActiveUsers: number;
  maxUsers: number;
  mobileFriendly: boolean;
  sessionBeginTime: NeosType.Common.NeosDateString;
  lastUpdate: NeosType.Common.NeosDateString;
  accessLevel: "FriendsOfFriends";
  hasEnded: boolean;
  isValid: boolean;
};
