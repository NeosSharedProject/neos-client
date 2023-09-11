import { BASE_URL, get, put } from "../common";
import * as NeosUtil from "../util";
import * as NeosType from "../type";

type CloudVariableValue = {
  ownerId: NeosType.Id.NeosUserId;
  path: string;
  value: string;
  partitionKey: string;
  rowKey: string;
  timestamp: NeosType.Common.NeosDateString;
  eTag: string;
};

export const apiGetCloudVariableValues = async ({
  userSession,
  overrideBaseUrl,
  ownerId,
}: {
  userSession?: NeosType.UserSession.NeosUserSession;
  overrideBaseUrl?: string;
  ownerId: NeosType.Id.NeosUserId;
}): Promise<CloudVariableValue[]> => {
  const response = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users/${ownerId}/vars/`,
    userSession
      ? {
          headers: NeosUtil.UserSession.getAuthHeader(userSession),
        }
      : {}
  );
  return response.data;
};

export const apiGetCloudVariableValue = async ({
  userSession,
  overrideBaseUrl,
  ownerId,
  path,
}: {
  userSession?: NeosType.UserSession.NeosUserSession;
  overrideBaseUrl?: string;
  ownerId: NeosType.Id.NeosUserId;
  path: string;
}): Promise<CloudVariableValue> => {
  const response = await get(
    `${overrideBaseUrl ?? BASE_URL}api/users/${ownerId}/vars/${path}`,
    userSession
      ? {
          headers: NeosUtil.UserSession.getAuthHeader(userSession),
        }
      : {}
  );
  return response.data;
};

export const apiPutCloudVariableValue = async ({
  userSession,
  overrideBaseUrl,
  ownerId,
  path,
  value,
}: {
  userSession?: NeosType.UserSession.NeosUserSession;
  overrideBaseUrl?: string;
  ownerId: NeosType.Id.NeosUserId;
  path: string;
  value: unknown;
}): Promise<void> => {
  await put(
    `${overrideBaseUrl ?? BASE_URL}api/users/${ownerId}/vars/${path}`,
    {
      value,
    },
    userSession
      ? {
          headers: NeosUtil.UserSession.getAuthHeader(userSession),
        }
      : {}
  );
};
