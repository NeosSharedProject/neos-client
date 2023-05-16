import { BASE_URL, get } from "../common";
import * as NeosUtil from "../util";
import * as NeosType from "../type";

export async function apiGetRecord({
  userSession,
  overrideBaseUrl,
  ownerId,
  recordId,
}: {
  userSession?: NeosType.UserSession.NeosUserSession;
  overrideBaseUrl?: string;
  ownerId: string;
  recordId: string;
}): Promise<NeosType.Record.NeosRecord> {
  const response = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users/${ownerId}/records/${recordId}`,
    userSession
      ? { headers: NeosUtil.UserSession.getAuthHeader(userSession) }
      : {}
  );
  return response.data;
}

export async function apiGetRecordFromPath({
  userSession,
  overrideBaseUrl,
  ownerId,
  path,
}: {
  userSession?: NeosType.UserSession.NeosUserSession;
  overrideBaseUrl?: string;
  ownerId: string;
  path: string;
}): Promise<NeosType.Record.NeosRecord> {
  const ownerType = NeosUtil.Common.resolveOwnerType(ownerId);
  if (!ownerType) {
    throw new Error(`invalid ownerId.ownerId=${ownerId}`);
  }
  const response = await get(
    `${
      overrideBaseUrl ?? BASE_URL
    }api/${ownerType}/${ownerId}/records/root/${path}`,
    userSession
      ? { headers: NeosUtil.UserSession.getAuthHeader(userSession) }
      : {}
  );
  return response.data;
}

export async function apiGetRecordsFromPath({
  userSession,
  overrideBaseUrl,
  ownerId,
  path,
}: {
  userSession?: NeosType.UserSession.NeosUserSession;
  overrideBaseUrl?: string;
  ownerId: string;
  path: string;
}): Promise<NeosType.Record.NeosRecord[]> {
  const ownerType = NeosUtil.Common.resolveOwnerType(ownerId);
  if (!ownerType) {
    throw new Error(`invalid ownerId.ownerId=${ownerId}`);
  }
  const response = await get(
    `${
      overrideBaseUrl ?? BASE_URL
    }api/${ownerType}/${ownerId}/records?path=${path}`,
    userSession
      ? { headers: NeosUtil.UserSession.getAuthHeader(userSession) }
      : {}
  );
  return response.data;
}
