import { apiPutCloudVariableValue } from "../../api/cloudVariableValues";
import { Neos } from "..";

export async function setCloudVariableValue(
  this: Neos,
  {
    ownerId: argOwnerId,
    path,
    value,
  }: { ownerId?: string; path: string; value: unknown }
): Promise<void> {
  const ownerId = argOwnerId ?? this.userSession?.userId;
  if (!ownerId) {
    throw new Error("ownerId error");
  }
  await apiPutCloudVariableValue({
    userSession: this.userSession,
    overrideBaseUrl: this.overrideBaseUrl,
    ownerId,
    path,
    value,
  });
}
