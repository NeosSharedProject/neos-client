Neos の API を使うためのクライアントです。

## usage

> npm i neos-client

```js
const { Neos } = require("neos-client");

const neos = new Neos({ username: "username ", password: "password" });

neos.on("Login", () => {
  console.log("Login: ", neos.currentUser);
});

neos.on("MessageReceived", (message) => {
  console.log("messageReceived: ", message);
  if (message.messageType === "Text") {
    neos.sendTextMessage({
      targetUserId: message.senderId,
      message: message.content,
    });
  }
});

neos.on("FriendRequested", (friend) => {
  console.log("FriendRequested: ", friend.friendUsername);
  neos.addFriend({ targetUserId: friend.id });
});

neos.login();
```

```js
const { NeosAPI } = "neos-client";

async function main() {
  const users = await NeosAPI.Users.apiFindUsers({ keyword: "NeosVR" });
  console.log(users.map((u) => u.username));

  const sessions = await NeosAPI.Sessions.apiGetSessions({});
  console.log(sessions.map((s) => s.name));

  const records = await NeosAPI.Records.apiGetRecordsFromPath({
    ownerId: "G-Neos",
    path: "Inventory\\Neos Essentials\\Mirror",
  });
  console.log(records.map((r) => r.name));
}

main();
```
