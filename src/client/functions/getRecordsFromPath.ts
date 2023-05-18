import { Neos } from "..";
import * as NeosAPI from "../../api";
import * as NeosType from "../../type";

export async function apiGetRecordsFromPath(
  this: Neos,
  { ownerId, path }: { ownerId: string; path: string }
): Promise<NeosType.Record.NeosRecord[]> {
  await this.checkSession();
  if (!this.userSession) {
    throw new Error("userSession error");
  }
  return await NeosAPI.Records.apiGetRecordsFromPath({
    userSession: this.userSession,
    overrideBaseUrl: this.overrideBaseUrl,
    ownerId,
    path,
  });
}
