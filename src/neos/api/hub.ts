import { Credential, getAuthHeader, post } from "../common";
import {
  HubConnectionBuilder,
  HubConnection,
  HttpTransportType,
} from "@microsoft/signalr";

export async function negotiateHub(credential: Credential): Promise<{
  negotiateVersion: number;
  url: string;
  accessToken: string;
  availableTransports: any[];
}> {
  return (
    await post(
      "https://api.neos.com/hub/negotiate",
      {},
      getAuthHeader(credential)
    )
  ).data;
}

export async function connectHub(
  credential: Credential,
  eventCallbacks: {
    methodName: "ReceiveMessage";
    callback: (data: any) => any;
  }[]
): Promise<HubConnection> {
  const data = await negotiateHub(credential);

  const connection = new HubConnectionBuilder()
    .withUrl(data.url + `&access_token=${data.accessToken}`, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    })
    .build();

  eventCallbacks.forEach(({ methodName, callback }) => {
    connection.on(methodName, (data) => {
      callback(data);
    });
  });

  connection.start();

  return connection;
}
