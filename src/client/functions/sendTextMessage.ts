import { Neos } from "..";
import { apiSendTextMessage } from "../../api/messages";
import * as NeosType from "../../type";

export async function sendTextMessage(
  this: Neos,
  {
    targetUserId,
    message,
  }: {
    targetUserId: NeosType.Id.NeosUserId;
    message: string;
  }
): Promise<NeosType.Message.TextMessage> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }

  if (this.eventManager?.messageManager) {
    return await this.eventManager.messageManager.sendTextMessage({
      userSession: this.userSession,
      targetUserId,
      message,
    });
  } else {
    return await apiSendTextMessage({
      userSession: this.userSession,
      targetUserId,
      message,
      overrideBaseUrl: this.overrideBaseUrl,
    });
  }
}
