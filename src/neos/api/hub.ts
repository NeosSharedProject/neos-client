import { Credential, getAuthHeader, post } from "../common";
import {
  HubConnectionBuilder,
  HubConnection,
  HttpTransportType,
} from "@microsoft/signalr";
import { MessageType, NeosMessageType } from "../type/message";
import { parseNeosMessage } from "../util/message";

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
    callback: (data: MessageType) => any;
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
    connection.on(methodName, (message: NeosMessageType) => {
      callback(parseNeosMessage(message));
    });
  });

  connection.start();

  return connection;
}
