import { NeosFriendType } from "../../type/friend";
import { getFriends as apiGetFriends } from "../../api/friends";
import { Neos } from "..";

export async function getFriends(this: Neos): Promise<NeosFriendType[]> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }
  return await apiGetFriends({ userSession: this.userSession });
}
