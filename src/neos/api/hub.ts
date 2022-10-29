import { Credential, getAuthHeader, post } from "../common";
import WebSocket from "ws";

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

export async function connectHub(credential: Credential): Promise<WebSocket> {
  const data = await negotiateHub(credential);
  const wss = new WebSocket(
    data.url.replace("https", "wss") + `&access_token=${data.accessToken}`
  );

  wss.on("open", () => {
    wss.send(`{"protocol":"json", "version":1}`);
  });

  return wss;
}
