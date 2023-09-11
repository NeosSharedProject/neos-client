import { Neos } from "..";
import * as NeosAPI from "../../api";
import * as NeosType from "../../type";

export async function getRecordFromPath(
  this: Neos,
  { ownerId, path }: { ownerId: string; path: string }
): Promise<NeosType.Record.NeosRecord> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }
  return await NeosAPI.Records.apiGetRecordFromPath({
    userSession: this.userSession,
    overrideBaseUrl: this.overrideBaseUrl,
    ownerId,
    path,
  });
}
