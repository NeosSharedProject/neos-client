import { BASE_URL, get, Credential, getAuthHeader } from "../common";

export async function getUser({
  credential,
  targetUserId,
}: {
  credential?: Credential;
  targetUserId: string;
}) {
  const response = await get(
    `${BASE_URL}api/users/${targetUserId}`,
    credential ? getAuthHeader(credential) : {}
  );
  return response.data;
}
