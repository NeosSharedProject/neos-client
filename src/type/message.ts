import * as NeosType from "./index";

export type NeosTextMessage = {
  id: NeosType.Id.NeosMessageId;
  ownerId: NeosType.Id.NeosUserId;
  recipientId: NeosType.Id.NeosUserId;
  senderId: NeosType.Id.NeosUserId;
  messageType: "Text";
  content: string;
  sendTime: NeosType.Common.NeosDateString;
  lastUpdateTime: NeosType.Common.NeosDateString;
  readTime: NeosType.Common.NeosDateString | null;
};

export type NeosObjectMessage = {
  id: NeosType.Id.NeosMessageId;
  ownerId: NeosType.Id.NeosUserId;
  recipientId: NeosType.Id.NeosUserId;
  senderId: NeosType.Id.NeosUserId;
  messageType: "Object";
  content: string;
  sendTime: NeosType.Common.NeosDateString;
  lastUpdateTime: NeosType.Common.NeosDateString;
  readTime: NeosType.Common.NeosDateString | null;
};

export type NeosCreditTransferMessage = {
  id: NeosType.Id.NeosMessageId;
  ownerId: NeosType.Id.NeosUserId;
  recipientId: NeosType.Id.NeosUserId;
  senderId: NeosType.Id.NeosUserId;
  messageType: "CreditTransfer";
  content: string;
  sendTime: NeosType.Common.NeosDateString;
  lastUpdateTime: NeosType.Common.NeosDateString;
  readTime: NeosType.Common.NeosDateString | null;
};

export type NeosSessionInviteMessage = {
  id: NeosType.Id.NeosMessageId;
  ownerId: NeosType.Id.NeosUserId;
  recipientId: NeosType.Id.NeosUserId;
  senderId: NeosType.Id.NeosUserId;
  messageType: "SessionInvite";
  content: string;
  sendTime: NeosType.Common.NeosDateString;
  lastUpdateTime: NeosType.Common.NeosDateString;
  readTime: NeosType.Common.NeosDateString | null;
};

export type NeosSoundMessage = {
  id: NeosType.Id.NeosMessageId;
  ownerId: NeosType.Id.NeosUserId;
  recipientId: NeosType.Id.NeosUserId;
  senderId: NeosType.Id.NeosUserId;
  messageType: "Sound";
  content: string;
  sendTime: NeosType.Common.NeosDateString;
  lastUpdateTime: NeosType.Common.NeosDateString;
  readTime: NeosType.Common.NeosDateString | null;
};

export type NeosMessage =
  | NeosTextMessage
  | NeosObjectMessage
  | NeosCreditTransferMessage
  | NeosSessionInviteMessage
  | NeosSoundMessage;

export type TextMessageContent = string;

export type ObjectMessageContent = {
  id: NeosType.Id.NeosRecordId;
  ownerId: NeosType.Id.NeosOwnerId;
  assetUri: NeosType.Common.NeosUri;
  globalVersion: number;
  localVersion: number;
  lastModifyingUserId: NeosType.Id.NeosUserId;
  lastModifyingMachineId: NeosType.Id.NeosMachineId;
  name: string;
  recordType: "object";
  ownerName: null | string;
  tags: string[];
  path: null | string;
  thumbnailUri: NeosType.Common.NeosUri;
  isPublic: boolean;
  isForPatrons: boolean;
  isListed: boolean;
  lastModificationTime: NeosType.Common.NeosDateString;
  creationTime: NeosType.Common.NeosDateString;
  firstPublishTime: null;
  visits: number;
  rating: number;
  randomOrder: number;
  submissions: null;
};

export type CreditTransferMessageContent = {
  token: "KFC" | "NCR";
  recipientId: NeosType.Id.NeosUserId;
  amount: number;
  comment: string;
  transactionType: "User2User" | "Tip" | "Deposit";
};

export type SessionInviteMessageContent = {
  name: string;
  description: string | null;
  correspondingWorldId: string | null;
  tags: string[];
  sessionId: NeosType.Id.NeosSessionId;
  normalizedSessionId: string;
  hostUserId: NeosType.Id.NeosUserId;
  hostMachineId: NeosType.Id.NeosMachineId;
  hostUsername: string;
  compatibilityHash: string;
  universeId: null | string;
  neosVersion: string;
  headlessHost: boolean;
  sessionURLs: NeosType.Common.NeosUri[];
  parentSessionIds: null | string[];
  nestedSessionIds: null | string[];
  sessionUsers: [] | NeosType.Id.NeosUserId[];
  thumbnail: NeosType.Common.NeosUri;
  joinedUsers: number;
  activeUsers: number;
  totalJoinedUsers: number;
  totalActiveUsers: number;
  maxUsers: number;
  mobileFriendly: boolean;
  sessionBeginTime: NeosType.Common.NeosDateString;
  lastUpdate: NeosType.Common.NeosDateString;
  awaySince: null;
  accessLevel: "Private" | "";
};

export type SoundMessageContent = {
  id: NeosType.Id.NeosRecordId;
  ownerId: NeosType.Id.NeosUserId;
  assetUri: NeosType.Common.NeosUri;
  globalVersion: number;
  localVersion: number;
  lastModifyingUserId: NeosType.Id.NeosUserId;
  lastModifyingMachineId: NeosType.Id.NeosMachineId;
  name: string;
  recordType: "audio";
  ownerName: null;
  tags: string[];
  path: null | string;
  isPublic: boolean;
  isForPatrons: boolean;
  isListed: boolean;
  lastModificationTime: NeosType.Common.NeosDateString;
  creationTime: NeosType.Common.NeosDateString;
  firstPublishTime: null | NeosType.Common.NeosDateString;
  visits: number;
  rating: number;
  randomOrder: number;
  submissions: null;
  neosDBmanifest: {
    hash: string;
    bytes: number;
  }[];
};

type _NotContentMessage<M extends NeosMessage> = Omit<M, "content">;

export type TextMessage = _NotContentMessage<NeosTextMessage> & {
  content: TextMessageContent;
};

export type ObjectMessage = _NotContentMessage<NeosObjectMessage> & {
  content: ObjectMessageContent;
};

export type CreditTransferMessage =
  _NotContentMessage<NeosCreditTransferMessage> & {
    content: CreditTransferMessageContent;
  };

export type SessionInviteMessage =
  _NotContentMessage<NeosSessionInviteMessage> & {
    content: SessionInviteMessageContent;
  };

export type SoundMessage = _NotContentMessage<NeosSoundMessage> & {
  content: SoundMessageContent;
};

export type Message =
  | TextMessage
  | ObjectMessage
  | CreditTransferMessage
  | SessionInviteMessage
  | SoundMessage;
