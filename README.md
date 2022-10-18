Neos の API を使うためのシンプルなクライアントです。

## how to use

> npm i neos-client

```
import Neos from "neos-client";

async function main() {
  const neos = new Neos("username", "password");

  console.log(await neos.getFriends());

  console.log(
    await neos.SendTextMessage({ targetUserId: "U-Neos", message: "Hello" })
  );

  console.log(await neos.SendKFC({ targetUserId: "U-Neos", amount: 0.1 }));

  console.log(await neos.getMessages({ targetUserId: "U-Neos" }));
}

main();
```
