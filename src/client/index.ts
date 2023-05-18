import { uuidv4 } from "../common";
import * as NeosType from "../type";
import { EventManager, EventType } from "./eventManager";
import { addFriend } from "./functions/addFriend";
import { getFriends } from "./functions/getFriends";
import { getMessages } from "./functions/getMessages";
import { getUser } from "./functions/getUser";
import { readMessages } from "./functions/readMessages";
import { sendTextMessage } from "./functions/sendTextMessage";
import { login } from "./functions/login";
import { logout } from "./functions/logout";
import { checkSession } from "./functions/checkSession";
import { sendKFC } from "./functions/sendKFC";
import { updateUserStatus } from "./functions/updateUserStatus";
import { getRecord } from "./functions/getRecord";
import { getRecordFromPath } from "./functions/getRecordFromPath";
import { apiGetRecordsFromPath } from "./functions/getRecordsFromPath";

export type NeosClientOption = {
  saveLoginCredential: boolean;
  overrideBaseUrl?: string;
  overrideHubUrl?: string;
} & (
  | { useEvents: false; autoSync: false }
  | { useEvents: true; autoSync: boolean }
);

export class Neos {
  loginCredential: NeosType.UserSession.NeosLoginCredential & {
    secretMachineId: string;
    rememberMe: true;
  };
  option: Readonly<NeosClientOption>;
  userSession?: NeosType.UserSession.NeosUserSession;
  eventManager?: EventManager;
  currentUser?: NeosType.User.NeosUser;
  overrideBaseUrl?: string;
  overrideHubUrl?: string;

  constructor(
    loginCredential: NeosType.UserSession.NeosLoginCredential,
    option?: NeosClientOption
  ) {
    this.loginCredential = {
      secretMachineId: uuidv4(),
      ...loginCredential,
      rememberMe: true,
    };
    this.option = option ?? {
      saveLoginCredential: false,
      useEvents: true,
      autoSync: true,
    };
    this.overrideBaseUrl = option?.overrideBaseUrl;
    this.overrideHubUrl = option?.overrideHubUrl;

    if (this.option.useEvents) {
      this.eventManager = new EventManager(this, {
        messageSync: this.option.autoSync,
      });
    }
  }

  login = login;
  logout = logout;
  checkSession = checkSession;

  addFriend = addFriend;
  getFriends = getFriends;
  getMessages = getMessages;
  getUser = getUser;
  updateUserStatus = updateUserStatus;
  readMessage = readMessages;
  sendTextMessage = sendTextMessage;
  sendKFC = sendKFC;
  getRecord = getRecord;
  getRecordFromPath = getRecordFromPath;
  getRecordsFromPath = apiGetRecordsFromPath;

  on(...[eventName, listener]: EventType) {
    this.eventManager?.on(eventName, listener);
  }
}
