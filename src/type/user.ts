import { NeosDateStringType, NeosUriType, NeosVersionType } from "./common";
import { NeosSessionIdType, NeosUserIdType } from "./id";
import { NeosSessionType } from "./session";

export type NeosUserStatusType =
  | {
      onlineStatus: "Offline";
      lastStatusChange: NeosDateStringType;
      currentSessionAccessLevel: 0;
      currentSessionHidden: boolean;
      currentHosting: boolean;
      outputDevice: "Unknown";
      isMobile: boolean;
    }
  | {
      onlineStatus: "Away";
      lastStatusChange: NeosDateStringType;
      currentSessionId: NeosSessionIdType;
      currentSessionAccessLevel: 0 | 2 | 3 | 4 | 5 | 6;
      currentSessionHidden: boolean;
      currentHosting: boolean;
      compatibilityHash: string;
      neosVersion: NeosVersionType;
      publicRSAKey: [Object];
      outputDevice: "Unknown" | "VR" | "Screen" | "Headless";
      isMobile: boolean;
      activeSessions: NeosSessionType[];
    }
  | {
      onlineStatus: "Online";
      lastStatusChange: NeosDateStringType;
      currentSessionId: NeosSessionIdType;
      currentSessionAccessLevel: 0 | 2 | 3 | 4 | 5 | 6;
      currentSessionHidden: boolean;
      currentHosting: boolean;
      compatibilityHash: string;
      neosVersion: NeosVersionType;
      publicRSAKey: [Object];
      outputDevice: "Unknown" | "VR" | "Screen" | "Headless";
      isMobile: boolean;
      currentSession: NeosSessionType;
      activeSessions: NeosSessionType[];
    };

export type NeosUserType = {
  id: NeosUserIdType;
  username: string;
  normalizedUsername: string;
  alternateNormalizedNames?: string[];
  registrationDate: NeosDateStringType;
  isVerified: boolean;
  quotaBytes: number;
  isLocked: boolean;
  supressBanEvasion: boolean;
  usedBytes: number;
  "2fa_login": boolean;
  tags: string[];
  profile?: {
    iconUrl?: NeosUriType;
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
    lastPlusActivationTime: NeosDateStringType;
    lastActivationTime: NeosDateStringType;
    lastPlusPledgeAmount: number;
    lastPaidPledgeAmount: number;
    accountName: string;
    currentAccountType: number;
    currentAccountCents: number;
    pledgedAccountType: number;
  };
};
