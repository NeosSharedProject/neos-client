import { Neos } from "..";
import { apiAddFriend } from "../../api/friends";
import * as NeosType from "../../type";

export async function addFriend(
  this: Neos,
  { targetUserId }: { targetUserId: NeosType.Id.NeosUserId }
): Promise<void> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }
  if (this.eventManager?.friendManager) {
    await this.eventManager.friendManager.addFriend({
      userSession: this.userSession,
      targetUserId,
    });
  } else {
    await apiAddFriend({
      userSession: this.userSession,
      targetUserId,
      overrideBaseUrl: this.overrideBaseUrl,
    });
  }
}
