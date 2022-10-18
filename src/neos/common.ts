import axios from "axios";
import { v4 } from "uuid";

export const BASE_URL = "https://api.neos.com/";

export type Credential = {
  userId: string;
  token: string;
  created: string;
  expire: string;
  rememberMe: boolean;
  secretMachineId: string;
  sourceIP: string;
  partitionKey: string;
  rowKey: string;
  timespamp: string;
  eTag: string;
};

export function isCredential(
  credential: Credential | undefined
): credential is Credential {
  return !!credential;
}

export function getAuthHeader(credential: Credential) {
  return {
    headers: {
      Authorization: `neos ${credential.userId}:${credential.token}`,
    },
  };
}

export const post = axios.post;
export const get = axios.get;
export const put = axios.put;

export const uuidv4 = v4;
