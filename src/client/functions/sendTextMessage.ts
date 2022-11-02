import { Neos } from "..";
import { NeosUserIdType } from "../../type/id";
import { TextMessageType } from "../../type/message";
import { sendTextMessage as apiSendTextMessage } from "../../api/messages";

export async function sendTextMessage(
  this: Neos,
  {
    targetUserId,
    message,
  }: {
    targetUserId: NeosUserIdType;
    message: string;
  }
): Promise<TextMessageType> {
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
    });
  }
}
