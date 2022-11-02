import { Neos } from "..";
import { addFriend as apiAddFriend } from "../../api/friends";

export async function addFriend(
  this: Neos,
  { targetUserId }: { targetUserId: string }
): Promise<void> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }
  return await apiAddFriend({
    userSession: this.userSession,
    targetUserId,
  });
}
