import { BASE_URL, get, Credential, getAuthHeader } from "../common";

export async function getUser({
  credential,
  userId,
}: {
  credential: Credential;
  userId: string;
}) {
  const response = await get(
    `${BASE_URL}api/users/${userId}`,
    getAuthHeader(credential)
  );
  return response.data;
}
