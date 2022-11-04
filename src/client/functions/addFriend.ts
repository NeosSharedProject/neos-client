import { Neos } from "..";
import { addFriend as apiAddFriend } from "../../api/friends";
import { NeosUserIdType } from "../../type/id";

export async function addFriend(
  this: Neos,
  { targetUserId }: { targetUserId: NeosUserIdType }
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
    });
  }
}
