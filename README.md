Neos の API を使うためのシンプルなクライアントです。

## how to use

> npm i neos-client

```
const Neos = require("neos-client");

async function main(){
  const neos = new Neos("username","password");

  console.log(await neos.getFriends());

  console.log(await neos.sendMessage("U-Neos", "hello"));

  console.log(await neos.sendKFC("U-Neos", 1))

  console.log(await neos.getMessages());
}

main()
```
