import { Neos } from "..";
import { deleteUserSession } from "../../api/userSessions";

export async function logout(this: Neos): Promise<void> {
  if (this.userSession) {
    await deleteUserSession({ userSession: this.userSession });
  }
  this.eventManager?.close();
}
