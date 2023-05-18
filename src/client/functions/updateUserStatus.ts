import { Neos } from "..";
import * as NeosAPI from "../../api";
import * as NeosType from "../../type";

export async function updateUserStatus(
  this: Neos,
  { status }: { status: NeosType.User.NeosUserStatusInput }
): Promise<void> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }
  await NeosAPI.Users.apiPutUserStatus({
    userSession: this.userSession,
    status,
    overrideBaseUrl: this.overrideBaseUrl,
  });
}
