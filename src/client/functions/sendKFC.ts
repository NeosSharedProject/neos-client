import { Neos } from "..";
import { NeosUserIdType } from "../../type/id";
import { sendKFC as apiSendKFC } from "../../api/messages";

export async function sendKFC(
  this: Neos,
  {
    targetUserId,
    amount,
    comment,
    totp,
  }: {
    targetUserId: NeosUserIdType;
    amount: number;
    comment?: string;
    totp: string;
  }
): Promise<void> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }

  await apiSendKFC({
    userSession: this.userSession,
    targetUserId,
    amount,
    comment,
    totp,
  });
}
