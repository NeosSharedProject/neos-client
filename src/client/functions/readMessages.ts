import { Neos } from "..";
import { markMessageRead } from "../../api/messages";
import { NeosMessageIdType } from "../../type/id";

export async function readMessages(
  this: Neos,
  {
    messageIds,
  }: {
    messageIds: NeosMessageIdType[];
  }
): Promise<NeosMessageIdType[]> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }

  if (this.eventManager?.messageManager) {
    return this.eventManager.messageManager.readMessages({
      userSession: this.userSession,
      messageIds,
    });
  } else {
    return await markMessageRead({
      messageIds,
      userSession: this.userSession,
    });
  }
}
