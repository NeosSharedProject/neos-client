import { apiAddFriend, apiGetFriends } from "../api/friends";
import { EventManager } from "./eventManager";
import * as NeosType from "../type";

export class FriendManager {
  localFriends?: NeosType.Friend.NeosFriend[];
  eventManager: EventManager;

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
  }

  public async syncFriends({
    userSession,
  }: {
    userSession: NeosType.UserSession.NeosUserSession;
  }): Promise<void> {
    const friends = await apiGetFriends({
      userSession,
      overrideBaseUrl: this.eventManager.neos.overrideBaseUrl,
    });
    if (this.localFriends) {
      const requestedFriends = friends.filter((friend) => {
        const prevFriend = this.localFriends?.find((f) => f.id === friend.id);
        return (
          (!prevFriend?.friendStatus ||
            prevFriend.friendStatus !== "Requested") &&
          friend.friendStatus === "Requested"
        );
      });
      requestedFriends.forEach((friend) => {
        this.eventManager.emit("FriendRequested", friend);
      });
      const onlineFriends = friends.filter((friend) => {
        const prevFriend = this.localFriends?.find((f) => f.id === friend.id);
        return (
          prevFriend?.userStatus.onlineStatus !== "Online" &&
          friend.userStatus.onlineStatus === "Online"
        );
      });
      onlineFriends.forEach((friend) => {
        this.eventManager.emit("FriendOnline", friend);
      });
    }
    this.localFriends = friends;
    this.eventManager.emit("FriendsUpdated", this.localFriends);
  }

  public async addFriend({
    userSession,
    targetUserId,
  }: {
    userSession: NeosType.UserSession.NeosUserSession;
    targetUserId: NeosType.Id.NeosUserId;
  }): Promise<void> {
    await apiAddFriend({
      userSession,
      targetUserId,
      overrideBaseUrl: this.eventManager.neos.overrideBaseUrl,
    });
    await this.syncFriends({ userSession });
  }
}
