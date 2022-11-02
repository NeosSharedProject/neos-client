import { getFriends, addFriend } from "./api/friends";
import { connectHub } from "./api/hub";
import {
  getMessages,
  sendTextMessage,
  sendKFC,
  markMessageRead,
} from "./api/messages";
import { deleteUserSession, postUserSession } from "./api/userSessions";
import { getUser } from "./api/users";
import { uuidv4 } from "./common";
import { HubConnection } from "@microsoft/signalr";
import { MessageType } from "./type/message";
import {
  NeosLoginCredentialType,
  NeosUserSessionType,
} from "./type/userSession";
import { NeosFriendType } from "./type/friend";
import { NeosMessageIdType, NeosUserIdType } from "./type/id";
import {
  MessagesReadEventArgumentType,
  ReceiveMessageEventArgumentType,
} from "./type/hub";

export type NeosClientOption = {
  saveLoginCredential: boolean;
  useEvents: boolean;
  autoSync: { messages: boolean };
};

export class Neos {
  loginCredential: NeosLoginCredentialType & {
    secretMachineId: string;
    rememberMe: true;
  };
  option: Readonly<NeosClientOption>;
  userSession?: NeosUserSessionType;
  hubConnection?: HubConnection;
  eventCallbacks: {
    messageReceived?: (message: ReceiveMessageEventArgumentType) => any;
    messageRead?: (data: MessagesReadEventArgumentType) => any;
    messageSend?: (message: MessageType) => any;
  } = {};
  messages?: MessageType[];

  constructor(login: NeosLoginCredentialType, option?: NeosClientOption) {
    this.loginCredential = {
      secretMachineId: uuidv4(),
      ...login,
      rememberMe: true,
    };
    this.option = option ?? {
      saveLoginCredential: false,
      useEvents: true,
      autoSync: { messages: true },
    };
  }

  private addLocalMessage(message: MessageType) {
    console.log(message);
    if (this.messages) {
      this.messages = [...this.messages, message];
      if (this.eventCallbacks.messageSend) {
        this.eventCallbacks.messageSend(message);
      }
    }
  }

  private readLocalMessage(data: MessagesReadEventArgumentType) {
    if (this.messages) {
      const newMessages = this.messages
        .filter((msg) => data.ids.some((id) => id === msg.id))
        .map((msg) => ({ ...msg, readTime: data.readTime }));
      this.messages = [
        ...this.messages.filter((msg) => data.ids.some((id) => id !== msg.id)),
        ...newMessages,
      ];
    }
  }

  private markLocalMessage(messageIds: NeosMessageIdType[]) {
    if (this.messages) {
      const readTime = new Date().toISOString();
      this.messages = this.messages.map((message) =>
        messageIds.some((id) => id === message.id)
          ? { ...message, readTime }
          : message
      );
    }
  }

  async login(): Promise<void> {
    try {
      this.userSession = await postUserSession({
        loginCredential: this.loginCredential,
      });
      if (!this.option.saveLoginCredential) {
        this.loginCredential = {
          ownerId: this.userSession.userId,
          sessionCode: this.userSession.token,
          secretMachineId: this.userSession.secretMachineId,
          rememberMe: true,
        };
      }
      if (!this.messages && this.option.autoSync.messages) {
        this.messages = await getMessages({ userSession: this.userSession });
      }
      if (!this.hubConnection) {
        this.hubConnection = await connectHub({
          userSession: this.userSession,
          eventCallbacks: [
            {
              methodName: "ReceiveMessage",
              callback: (message) => {
                this.addLocalMessage(message);
                if (this.eventCallbacks.messageReceived) {
                  this.eventCallbacks.messageReceived(message);
                }
              },
            },
            {
              methodName: "MessagesRead",
              callback: (data) => {
                console.log(data);
                this.readLocalMessage(data);
                if (this.eventCallbacks.messageRead) {
                  this.eventCallbacks.messageRead(data);
                }
              },
            },
          ],
        });
      }
    } catch (e) {
      this.userSession = undefined;
      throw new Error("login error");
    }
  }

  async logout(): Promise<void> {
    if (this.userSession) {
      await deleteUserSession({ userSession: this.userSession });
    }
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = undefined;
    }
  }

  async checkSession(): Promise<void> {
    if (!this.userSession || new Date(this.userSession.expire) < new Date()) {
      await this.login();
    }
  }

  async getFriends(): Promise<NeosFriendType[]> {
    await this.checkSession();
    if (!this.userSession) {
      throw new Error("userSession error");
    }
    return await getFriends({ userSession: this.userSession });
  }

  async addFriend({ targetUserId }: { targetUserId: string }): Promise<any> {
    await this.checkSession();
    if (!this.userSession) {
      throw new Error("userSession error");
    }
    return await addFriend({
      userSession: this.userSession,
      targetUserId,
    });
  }

  async setEventCallback({
    type,
    callback,
  }:
    | {
        type: "messageReceived";
        callback: (data: ReceiveMessageEventArgumentType) => any;
      }
    | { type: "messageSend"; callback: (data: MessageType) => any }
    | {
        type: "messageRead";
        callback: (data: MessagesReadEventArgumentType) => any;
      }) {
    switch (type) {
      case "messageReceived":
        this.eventCallbacks.messageReceived = callback;
        break;
      case "messageSend":
        this.eventCallbacks.messageSend = callback;
        break;
      case "messageRead":
        this.eventCallbacks.messageRead = callback;
        break;
    }
  }

  async getMessages({
    targetUserId,
    unReadOnly,
    fromTime,
  }: {
    targetUserId?: NeosUserIdType;
    unReadOnly?: boolean;
    fromTime?: Date;
  }): Promise<MessageType[]> {
    await this.checkSession();
    if (!this.userSession) {
      throw new Error("userSession error");
    }
    return await getMessages({
      userSession: this.userSession,
      targetUserId,
      unReadOnly,
      fromTime,
    });
  }

  async sendTextMessage({
    targetUserId,
    message,
  }: {
    targetUserId: NeosUserIdType;
    message: string;
  }): Promise<MessageType> {
    await this.checkSession();
    if (!this.userSession) {
      throw new Error("userSession error");
    }

    const body = await sendTextMessage({
      userSession: this.userSession,
      targetUserId,
      message,
    });
    if (this.option.autoSync.messages && this.messages) {
      await this.addLocalMessage(body);
    }
    return body;
  }

  async markMessageRead({ messageIds }: { messageIds: NeosMessageIdType[] }) {
    await this.checkSession();
    if (!this.userSession) {
      throw new Error("userSession error");
    }
    this.markLocalMessage(messageIds);
    await markMessageRead({
      messageIds,
      userSession: this.userSession,
    });
  }

  async sendKFC({
    targetUserId,
    amount,
    comment,
  }: {
    targetUserId: string;
    amount: number;
    comment?: string;
  }): Promise<any> {
    await this.checkSession();
    if (!this.userSession) {
      throw new Error("userSession error");
    }
    return await sendKFC({
      userSession: this.userSession,
      targetUserId,
      amount,
      comment,
    });
  }

  async getUser({ targetUserId }: { targetUserId: string }) {
    await this.checkSession();
    if (!this.userSession) {
      throw new Error("userSession error");
    }
    return getUser({ userSession: this.userSession, targetUserId });
  }
}
