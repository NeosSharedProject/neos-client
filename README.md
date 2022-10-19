Neos の API を使うためのシンプルなクライアントです。

## how to use

> npm i neos-client

```
import Neos from "neos-client";

async function main() {
  const neos = new Neos("username", "password");

  console.log(await neos.getFriends());

  console.log(
    await neos.sendTextMessage({ targetUserId: "U-Neos", message: "Hello" })
  );

  // console.log(await neos.sendKFC({ targetUserId: "U-***", amount: 0.1 }));

  console.log(await neos.getMessages({ userId: "U-Neos" }));
}

main();
```

```
import Neos from "neos-client";

async function main() {
  const neos = new Neos("username", "password");

  console.log(await neos.getFriends());

  console.log(
    await neos.sendTextMessage({ targetUserId: "U-Neos", message: "Hello" })
  );

  // console.log(await neos.sendKFC({ targetUserId: "U-***", amount: 0.1 }));

  console.log(await neos.getMessages({ userId: "U-Neos" }));
}

main();
```
