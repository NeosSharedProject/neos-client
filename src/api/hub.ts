import {
  HubConnectionBuilder,
  HubConnection,
  HttpTransportType,
} from "@microsoft/signalr";
import { post } from "../common";
import { NeosUserSessionType } from "../type/userSession";
import { parseNeosMessage } from "../util/message";
import { getAuthHeader } from "../util/userSession";
import { EventCallbackListType } from "../type/hub";

export type NeosHubNegotiation = {
  negotiateVersion: number;
  url: string;
  accessToken: string;
  availableTransports: any[];
};

export async function negotiateHub({
  userSession,
}: {
  userSession: NeosUserSessionType;
}): Promise<NeosHubNegotiation> {
  return (
    await post(
      "https://api.neos.com/hub/negotiate",
      {},
      { headers: getAuthHeader(userSession) }
    )
  ).data;
}

export async function connectHub({
  userSession,
  eventCallbacks,
}: {
  userSession: NeosUserSessionType;
  eventCallbacks: EventCallbackListType;
}): Promise<HubConnection> {
  const data = await negotiateHub({ userSession });

  const connection = new HubConnectionBuilder()
    .withUrl(data.url + `&access_token=${data.accessToken}`, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    })
    .build();

  eventCallbacks.forEach(({ methodName, callback }) => {
    connection.on(methodName, (data: any) => {
      switch (methodName) {
        case "ReceiveMessage":
          callback(parseNeosMessage(data));
          break;
        case "MessagesRead":
          callback(data);
          break;
      }
    });
  });

  connection.start();

  return connection;
}
