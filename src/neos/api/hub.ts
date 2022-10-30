import { Credential, getAuthHeader, post } from "../common";
import { io, Socket } from "socket.io-client";

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
  eventCallback: (data: any) => any
): Promise<Socket> {
  const data = await negotiateHub(credential);
  const url =
    data.url.replace("https", "wss") + `&access_token=${data.accessToken}`;
  console.log(url);
  const wss = io(url, { autoConnect: true });

  wss.connect();

  wss.on("error", (err) => {
    console.error(err);
  });
  wss.on("open", () => {
    console.log("connect");
    wss.emit("sendMessage", `{"protocol":"json", "version":1}`);
  });
  wss.on("receiveMessage", (data) => {
    console.log(data);
    // if (message.type === "utf8") {
    //   try {
    //     const data = JSON.parse(message.utf8Data.replace("", ""));
    //     if (data.type && data.type !== 6) {
    //       eventCallback(data);
    //     }
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
  });
  console.log(wss);

  return wss;
}
