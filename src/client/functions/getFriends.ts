import { apiGetFriends } from "../../api/friends";
import { Neos } from "..";
import * as NeosType from "../../type";

export async function getFriends(
  this: Neos
): Promise<NeosType.Friend.NeosFriend[]> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }
  return await apiGetFriends({
    userSession: this.userSession,
    overrideBaseUrl: this.overrideBaseUrl,
  });
}
