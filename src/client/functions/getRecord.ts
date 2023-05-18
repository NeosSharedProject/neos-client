import { Neos } from "..";
import * as NeosAPI from "../../api";
import * as NeosType from "../../type";

export async function getRecord(
  this: Neos,
  { ownerId, recordId }: { ownerId: string; recordId: string }
): Promise<NeosType.Record.NeosRecord> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }
  return await NeosAPI.Records.apiGetRecord({
    userSession: this.userSession,
    overrideBaseUrl: this.overrideBaseUrl,
    ownerId,
    recordId,
  });
}
