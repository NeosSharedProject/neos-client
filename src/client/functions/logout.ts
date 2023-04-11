import { Neos } from "..";
import { apiDeleteUserSession } from "../../api/userSessions";

export async function logout(this: Neos): Promise<void> {
  if (this.userSession) {
    await apiDeleteUserSession({
      userSession: this.userSession,
      overrideBaseUrl: this.overrideBaseUrl,
    });
  }
  this.eventManager?.close();
}
