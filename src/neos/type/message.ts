import { NeosDateStringType } from "./common";
import {
  NeosMachineIdType,
  NeosMessageIdType,
  NeosOwnerIdType,
  NeosRecordIdType,
  NeosSessionIdType,
  NeosUserIdType,
} from "./id";
import { NeosUriType } from "./uri";

export type NeosTextMessageType = {
  id: NeosMessageIdType;
  ownerId: NeosUserIdType;
  recipientId: NeosUserIdType;
  senderId: NeosUserIdType;
  messageType: "Text";
  content: string;
  sendTime: NeosDateStringType;
  lastUpdateTime: NeosDateStringType;
  readTime: NeosDateStringType | null;
};

export type NeosObjectMessageType = {
  id: NeosMessageIdType;
  ownerId: NeosUserIdType;
  recipientId: NeosUserIdType;
  senderId: NeosUserIdType;
  messageType: "Object";
  content: string;
  sendTime: NeosDateStringType;
  lastUpdateTime: NeosDateStringType;
  readTime: NeosDateStringType | null;
};

export type NeosCreditTransferMessageType = {
  id: NeosMessageIdType;
  ownerId: NeosUserIdType;
  recipientId: NeosUserIdType;
  senderId: NeosUserIdType;
  messageType: "CreditTransfer";
  content: string;
  sendTime: NeosDateStringType;
  lastUpdateTime: NeosDateStringType;
  readTime: NeosDateStringType | null;
};

export type NeosSessionInviteMessageType = {
  id: NeosMessageIdType;
  ownerId: NeosUserIdType;
  recipientId: NeosUserIdType;
  senderId: NeosUserIdType;
  messageType: "SessionInvite";
  content: string;
  sendTime: NeosDateStringType;
  lastUpdateTime: NeosDateStringType;
  readTime: NeosDateStringType | null;
};

export type NeosSoundMessageType = {
  id: NeosMessageIdType;
  ownerId: NeosUserIdType;
  recipientId: NeosUserIdType;
  senderId: NeosUserIdType;
  messageType: "Sound";
  content: string;
  sendTime: NeosDateStringType;
  lastUpdateTime: NeosDateStringType;
  readTime: NeosDateStringType | null;
};

export type NeosMessageType =
  | NeosTextMessageType
  | NeosObjectMessageType
  | NeosCreditTransferMessageType
  | NeosSessionInviteMessageType
  | NeosSoundMessageType;

export type TextMessageContentType = string;

export type ObjectMessageContentType = {
  id: NeosRecordIdType;
  ownerId: NeosOwnerIdType;
  assetUri: NeosUriType;
  globalVersion: number;
  localVersion: number;
  lastModifyingUserId: NeosUserIdType;
  lastModifyingMachineId: NeosMachineIdType;
  name: string;
  recordType: "object";
  ownerName: null | string;
  tags: string[];
  path: null | string;
  thumbnailUri: NeosUriType;
  isPublic: boolean;
  isForPatrons: boolean;
  isListed: boolean;
  lastModificationTime: NeosDateStringType;
  creationTime: NeosDateStringType;
  firstPublishTime: null;
  visits: number;
  rating: number;
  randomOrder: number;
  submissions: null;
};

export type CreditTransferMessageContentType = {
  token: "KFC" | "NCR";
  recipientId: NeosUserIdType;
  amount: number;
  comment: string;
  transactionType: "User2User" | "Tip" | "Deposit";
};

export type SessionInviteMessageContentType = {
  name: string;
  description: string | null;
  correspondingWorldId: string | null;
  tags: string[];
  sessionId: NeosSessionIdType;
  normalizedSessionId: string;
  hostUserId: NeosUserIdType;
  hostMachineId: NeosMachineIdType;
  hostUsername: string;
  compatibilityHash: string;
  universeId: null | string;
  neosVersion: string;
  headlessHost: boolean;
  sessionURLs: NeosUriType[];
  parentSessionIds: null | string[];
  nestedSessionIds: null | string[];
  sessionUsers: [] | NeosUserIdType[];
  thumbnail: NeosUriType;
  joinedUsers: number;
  activeUsers: number;
  totalJoinedUsers: number;
  totalActiveUsers: number;
  maxUsers: number;
  mobileFriendly: boolean;
  sessionBeginTime: NeosDateStringType;
  lastUpdate: NeosDateStringType;
  awaySince: null;
  accessLevel: "Private" | "";
};

export type SoundMessageContentType = {
  id: NeosRecordIdType;
  ownerId: NeosUserIdType;
  assetUri: NeosUriType;
  globalVersion: number;
  localVersion: number;
  lastModifyingUserId: NeosUserIdType;
  lastModifyingMachineId: NeosMachineIdType;
  name: string;
  recordType: "audio";
  ownerName: null;
  tags: string[];
  path: null | string;
  isPublic: boolean;
  isForPatrons: boolean;
  isListed: boolean;
  lastModificationTime: NeosDateStringType;
  creationTime: NeosDateStringType;
  firstPublishTime: null | NeosDateStringType;
  visits: number;
  rating: number;
  randomOrder: number;
  submissions: null;
  neosDBmanifest: {
    hash: string;
    bytes: number;
  }[];
};

type _NotContentMessageType<M extends NeosMessageType> = Omit<M, "content">;

export type TextMessageType = _NotContentMessageType<NeosTextMessageType> & {
  content: TextMessageContentType;
};

export type ObjectMessageType =
  _NotContentMessageType<NeosObjectMessageType> & {
    content: ObjectMessageContentType;
  };

export type CreditTransferMessageType =
  _NotContentMessageType<NeosCreditTransferMessageType> & {
    content: CreditTransferMessageContentType;
  };

export type SessionInviteMessageType =
  _NotContentMessageType<NeosSessionInviteMessageType> & {
    content: SessionInviteMessageContentType;
  };

export type SoundMessageType = _NotContentMessageType<NeosSoundMessageType> & {
  content: SoundMessageContentType;
};

export type MessageType =
  | TextMessageType
  | ObjectMessageType
  | CreditTransferMessageType
  | SessionInviteMessageType
  | SoundMessageType;
