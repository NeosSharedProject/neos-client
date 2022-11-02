import { NeosDateStringType, NeosUriType } from "./common";
import { NeosUserIdType } from "./id";
import { NeosUserStatusType } from "./user";

export type NeosFriendType = {
  id: NeosUserIdType;
  friendUsername: string;
  friendStatus: "Accepted" | "None";
  isAccepted: boolean;
  userStatus: NeosUserStatusType;
  profile: { iconUrl?: NeosUriType };
  latestMessageTime: NeosDateStringType;
  ownerId: NeosUserIdType;
};
