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
      ].filter((v) => v)
    );
  } catch (e) {
    this.userSession = undefined;
    throw new Error("login error");
  }
}
