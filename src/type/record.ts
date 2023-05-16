import * as NeosType from "./index";

export type NeosDirectoryRecord = {
  id: NeosType.Id.NeosRecordId;
  globalVersion: number;
  localVersion: number;
  lastModifyingUserId: NeosType.Id.NeosUserId;
  lastModifyingMachineId: NeosType.Id.NeosMachineId;
  name: string;
  recordType: "directory";
  ownerName: NeosType.Id.NeosOwnerId;
  tags: string[];
  path: string;
  isPublic: boolean;
  isForPatrons: boolean;
  isListed: boolean;
  isDeleted: boolean;
  creationTime: NeosType.Common.NeosDateString;
  lastModificationTime: NeosType.Common.NeosDateString;
  randomOrder: number;
  visits: number;
  rating: number;
  neosDBmanifest: {
    hash: string;
    bytes: number;
  }[];
  ownerId: NeosType.Id.NeosOwnerId;
};

export type NeosLinkRecord = {
  id: NeosType.Id.NeosRecordId;
  assetUri: NeosType.Common.NeosUri;
  globalVersion: number;
  localVersion: number;
  lastModifyingUserId: NeosType.Id.NeosUserId;
  lastModifyingMachineId: NeosType.Id.NeosMachineId;
  name: string;
  recordType: "link";
  ownerName: string;
  tags: string[];
  path: string;
  isPublic: boolean;
  isForPatrons: boolean;
  isListed: boolean;
  isDeleted: boolean;
  creationTime: NeosType.Common.NeosDateString;
  lastModificationTime: NeosType.Common.NeosDateString;
  randomOrder: number;
  visits: number;
  rating: number;
  ownerId: NeosType.Id.NeosOwnerId;
};

export type NeosObjectRecord = {
  id: NeosType.Id.NeosRecordId;
  assetUri: NeosType.Common.NeosUri;
  globalVersion: number;
  localVersion: number;
  lastModifyingUserId: NeosType.Id.NeosUserId;
  lastModifyingMachineId: NeosType.Id.NeosMachineId;
  name: string;
  recordType: "object";
  ownerName: string;
  tags: string[];
  path: string;
  thumbnailUri: NeosType.Common.NeosUri;
  isPublic: boolean;
  isForPatrons: boolean;
  isListed: boolean;
  isDeleted: boolean;
  creationTime: NeosType.Common.NeosDateString;
  lastModificationTime: NeosType.Common.NeosDateString;
  randomOrder: number;
  visits: number;
  rating: number;
  ownerId: NeosType.Id.NeosOwnerId;
};

export type NeosRecord =
  | NeosDirectoryRecord
  | NeosLinkRecord
  | NeosObjectRecord;
