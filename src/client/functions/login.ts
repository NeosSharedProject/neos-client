import { Neos } from "..";
import { apiPostUserSession } from "../../api/userSessions";
import { isPasswordCredential } from "../../util/userSession";

export async function login(this: Neos): Promise<void> {
  try {
    this.userSession = await apiPostUserSession({
      loginCredential: this.loginCredential,
      overrideBaseUrl: this.overrideBaseUrl,
    });

    if (
      !this.option.saveLoginCredential ||
      !isPasswordCredential(this.loginCredential)
    ) {
      this.loginCredential = {
        ownerId: this.userSession.userId,
        sessionCode: this.userSession.token,
        secretMachineId: this.userSession.secretMachineId,
        rememberMe: true,
      };
    }

    let tasks = [];
    if (this.option.autoSync) {
      this.eventManager?.initSync();
      tasks.push(
        (async () => {
          if (this.userSession) {
            this.currentUser = await this.getUser({
              targetUserId: this.userSession.userId,
            });
          }
        })()
      );
    }

    tasks.push(
      this.eventManager?.connectHub({ userSession: this.userSession })
    );

    await Promise.all(tasks);

    this.eventManager?.emit("Login");
  } catch (e) {
    console.error(e);
    this.userSession = undefined;
    throw new Error("login error");
  }
}
