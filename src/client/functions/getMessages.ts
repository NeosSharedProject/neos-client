import { Neos } from "..";
import { apiGetMessages } from "../../api/messages";
import * as NeosType from "../../type";

export async function getMessages(
  this: Neos,
  {
    targetUserId,
    unReadOnly,
    fromTime,
  }: {
    targetUserId?: NeosType.Id.NeosUserId;
    unReadOnly?: boolean;
    fromTime?: Date;
  }
): Promise<NeosType.Message.Message[]> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }

  if (
    !fromTime &&
    !unReadOnly &&
    this.eventManager?.messageManager?.localMessages
  ) {
    return this.eventManager.messageManager.localMessages;
  } else {
    return await apiGetMessages({
      userSession: this.userSession,
      targetUserId,
      unReadOnly,
      fromTime,
      overrideBaseUrl: this.overrideBaseUrl,
    });
  }
}
