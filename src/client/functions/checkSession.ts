import { Neos } from "..";

export async function checkSession(this: Neos): Promise<void> {
  if (!this.userSession || new Date(this.userSession.expire) < new Date()) {
    await this.login();
  }
}
