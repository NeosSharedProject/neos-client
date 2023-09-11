import { apiGetCloudVariableValue } from "../../api/cloudVariableValues";
import { Neos } from "..";

export async function getCloudVariableValue(
  this: Neos,
  { ownerId: argOwnerId, path }: { ownerId?: string; path: string }
): Promise<ReturnType<typeof apiGetCloudVariableValue>> {
  const ownerId = argOwnerId ?? this.userSession?.userId;
  if (!ownerId) {
    throw new Error("ownerId error");
  }
  return await apiGetCloudVariableValue({
    userSession: this.userSession,
    overrideBaseUrl: this.overrideBaseUrl,
    ownerId,
    path,
  });
}
