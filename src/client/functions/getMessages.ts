import { Neos } from "..";
import { NeosUserIdType } from "../../type/id";
import { MessageType } from "../../type/message";
import { getMessages as apiGetMessages } from "../../api/messages";

export async function getMessages(
  this: Neos,
  {
    targetUserId,
    unReadOnly,
    fromTime,
  }: {
    targetUserId?: NeosUserIdType;
    unReadOnly?: boolean;
    fromTime?: Date;
  }
): Promise<MessageType[]> {
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
    });
  }
}
