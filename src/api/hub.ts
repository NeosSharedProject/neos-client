import {
  HubConnectionBuilder,
  HubConnection,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";
import { BASE_URL, post } from "../common";
import { parseNeosMessage } from "../util/message";
import * as NeosUtil from "../util";
import * as NeosType from "../type";

export type NeosHubNegotiation = {
  negotiateVersion: number;
  url: string;
  accessToken: string;
  availableTransports: any[];
};

export const apiNegotiateHub = async ({
  userSession,
  overrideBaseUrl,
}: {
  userSession: NeosType.UserSession.NeosUserSession;
  overrideBaseUrl?: string;
}): Promise<NeosHubNegotiation> => {
  return (
    await post(
      `${overrideBaseUrl ?? BASE_URL}hub/negotiate`,
      {},
      { headers: NeosUtil.UserSession.getAuthHeader(userSession) }
    )
  ).data;
};

export const apiConnectHub = async ({
  userSession,
  eventCallbacks,
  overrideBaseUrl,
  overrideHubUrl,
}: {
  userSession: NeosType.UserSession.NeosUserSession;
  eventCallbacks?: NeosType.Hub.EventCallbackList;
  overrideBaseUrl?: string;
  overrideHubUrl?: string;
}): Promise<HubConnection> => {
  const data = await apiNegotiateHub({ userSession, overrideBaseUrl });

  const connection = new HubConnectionBuilder()
    .withUrl(
      (overrideHubUrl
        ? `${overrideHubUrl}${data.url
            .split("/")
            .filter((_s, i) => i > 2)
            .join("/")}`
        : data.url) + `&access_token=${data.accessToken}`,
      {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      }
    )
    .configureLogging(LogLevel.Error)
    .build();

  eventCallbacks?.forEach(({ methodName, callback }) => {
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
};

export const sendMessageHub = async ({
  connection,
  message,
}: {
  connection: HubConnection;
  message: NeosType.Message.Message;
}) => {
  await connection.send("SendMessage", message);
};

export const markMessageReadHub = async ({
  connection,
  markReadBatch,
}: {
  connection: HubConnection;
  markReadBatch: NeosType.Hub.MessagesReadEventArgument;
}) => {
  await connection.send("MarkMessagesRead", markReadBatch);
};
