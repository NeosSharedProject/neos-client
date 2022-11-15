import { uuidv4 } from "../common";
import {
  NeosLoginCredentialType,
  NeosUserSessionType,
} from "../type/userSession";
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
import { NeosUserType } from "../type/user";
import { sendKFC } from "./functions/sendKfc";

export type NeosClientOption = {
  saveLoginCredential: boolean;
} & (
  | { useEvents: false; autoSync: false }
  | { useEvents: true; autoSync: boolean }
);

export class Neos {
  loginCredential: NeosLoginCredentialType & {
    secretMachineId: string;
    rememberMe: true;
  };
  option: Readonly<NeosClientOption>;
  userSession?: NeosUserSessionType;
  eventManager?: EventManager;
  currentUser?: NeosUserType;

  constructor(
    loginCredential: NeosLoginCredentialType,
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
  readMessage = readMessages;
  sendTextMessage = sendTextMessage;
  sendKFC = sendKFC;

  on(...[eventName, listener]: EventType) {
    this.eventManager?.on(eventName, listener);
  }
}
