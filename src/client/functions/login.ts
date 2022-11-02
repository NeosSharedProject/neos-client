import { Neos } from "..";
import { postUserSession } from "../../api/userSessions";
import { isPasswordCredential } from "../../util/userSession";

export async function login(this: Neos): Promise<void> {
  try {
    this.userSession = await postUserSession({
      loginCredential: this.loginCredential,
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

    await Promise.all(
      [
        this.eventManager?.connectHub({ userSession: this.userSession }),
        this.eventManager?.messageManager?.syncMessages({
          userSession: this.userSession,
        }),
        this.option.autoSync
          ? (async () => {
              if (this.userSession) {
                this.currentUser = await this.getUser({
                  targetUserId: this.userSession.userId,
                });
              }
            })()
          : undefined,
      ].filter((v) => v)
    );

    this.eventManager?.emit("Login");
  } catch (e) {
    console.error(e);
    this.userSession = undefined;
    throw new Error("login error");
  }
}
