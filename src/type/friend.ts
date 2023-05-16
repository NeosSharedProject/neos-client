import * as NeosType from "./index";

export type NeosFriend = {
  id: NeosType.Id.NeosUserId;
  friendUsername: string;
  friendStatus: "Accepted" | "Requested" | "None";
  isAccepted: boolean;
  userStatus: NeosType.User.NeosUserStatus;
  profile: { iconUrl?: NeosType.Common.NeosUri };
  latestMessageTime: NeosType.Common.NeosDateString;
  ownerId: NeosType.Id.NeosUserId;
};
