import * as NeosType from "./index";

//TODO どんな値があるか調査して書く。
export type NeosUserStatus =
  | {
      onlineStatus: "Offline";
      lastStatusChange: NeosType.Common.NeosDateString;
      currentSessionAccessLevel: 0;
      currentSessionHidden: boolean;
      currentHosting: boolean;
      outputDevice: "Unknown";
      isMobile: boolean;
    }
  | {
      onlineStatus: "Away";
      lastStatusChange: NeosType.Common.NeosDateString;
      currentSessionId: NeosType.Id.NeosSessionId;
      currentSessionAccessLevel: 0 | 2 | 3 | 4 | 5 | 6;
      currentSessionHidden: boolean;
      currentHosting: boolean;
      compatibilityHash: string;
      neosVersion: NeosType.Common.NeosVersion;
      publicRSAKey: [Object];
      outputDevice: "Unknown" | "VR" | "Screen" | "Headless";
      isMobile: boolean;
      activeSessions: NeosType.Session.NeosSession[];
    }
  | {
      onlineStatus: "Online";
      lastStatusChange: NeosType.Common.NeosDateString;
      currentSessionId: NeosType.Id.NeosSessionId;
      currentSessionAccessLevel: 0 | 2 | 3 | 4 | 5 | 6;
      currentSessionHidden: boolean;
      currentHosting: boolean;
      compatibilityHash: string;
      neosVersion: NeosType.Common.NeosVersion;
      publicRSAKey: [Object];
      outputDevice: "Unknown" | "VR" | "Screen" | "Headless";
      isMobile: boolean;
      currentSession: NeosType.Session.NeosSession;
      activeSessions: NeosType.Session.NeosSession[];
    };

export type NeosUser = {
  id: NeosType.Id.NeosUserId;
  username: string;
  normalizedUsername: string;
  alternateNormalizedNames?: string[];
  registrationDate: NeosType.Common.NeosDateString;
  isVerified: boolean;
  quotaBytes: number;
  isLocked: boolean;
  supressBanEvasion: boolean;
  usedBytes: number;
  "2fa_login": boolean;
  tags: string[];
  profile?: {
    iconUrl?: NeosType.Common.NeosUri;
  };
  patreonData?: {
    isPatreonSupporter: boolean;
    lastPatreonPledgeCents: number;
    lastTotalCents: number;
    minimumTotalUnits: number;
    externalCents: number;
    lastExternalCents: number;
    hasSupported: boolean;
    lastIsAnorak: boolean;
    priorityIssue: number;
    lastPlusActivationTime: NeosType.Common.NeosDateString;
    lastActivationTime: NeosType.Common.NeosDateString;
    lastPlusPledgeAmount: number;
    lastPaidPledgeAmount: number;
    accountName: string;
    currentAccountType: number;
    currentAccountCents: number;
    pledgedAccountType: number;
  };
};
