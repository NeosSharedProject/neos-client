import { Neos } from "..";
import { apiGetUser } from "../../api/users";

export async function getUser(
  this: Neos,
  { targetUserId }: { targetUserId: string }
) {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }
  return apiGetUser({
    userSession: this.userSession,
    targetUserId,
    overrideBaseUrl: this.overrideBaseUrl,
  });
}
