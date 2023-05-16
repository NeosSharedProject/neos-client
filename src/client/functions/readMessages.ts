import { Neos } from "..";
import { apiMarkMessageRead } from "../../api/messages";
import * as NeosType from "../../type";

export async function readMessages(
  this: Neos,
  {
    messageIds,
  }: {
    messageIds: NeosType.Id.NeosMessageId[];
  }
): Promise<NeosType.Id.NeosMessageId[]> {
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
    return await apiMarkMessageRead({
      messageIds,
      userSession: this.userSession,
      overrideBaseUrl: this.overrideBaseUrl,
    });
  }
}
