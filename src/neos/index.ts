import { getFriends, addFriend } from "./api/friends";
import { connectHub } from "./api/hub";
import {
  getMessages,
  sendTextMessage,
  sendKFC,
  markMessageRead,
} from "./api/messages";
import { login, LoginInput } from "./api/userSessions";
import { getUser } from "./api/user";
import { Credential, isCredential, uuidv4 } from "./common";
import { HubConnection } from "@microsoft/signalr";

export type LoginCredential = LoginInput & { secretMachineId: string };

export class Neos {
  info: {
    login: LoginCredential;
    credential?: Credential;
  };
  wss: HubConnection | undefined;
  eventCallbacks: {
    messageReceived?: (message: {
      id: string;
      ownerId: string;
      recipientId: string;
      senderId: string;
      messageType: "Text" | "Object";
      content: string;
      sendTime: string;
      lastUpdateTime: string;
      readTime: string | null;
    }) => any;
  } = {};

  constructor(login: LoginInput) {
    this.info = {
      login: { secretMachineId: uuidv4().replace(/-/g, ""), ...login },
    };
  }

  async login(): Promise<void> {
    this.info.credential = await login(this.info.login);
    this.wss = await connectHub(this.info.credential, [
      {
        methodName: "ReceiveMessage",
        callback: (data) => {
          if (this.eventCallbacks.messageReceived) {
            this.eventCallbacks.messageReceived(data);
          }
        },
      },
    ]);
  }

  async checkSession(): Promise<void> {
    if (
      !isCredential(this.info.credential) ||
      new Date(this.info.credential.expire) < new Date()
    ) {
      await this.login();
    }
  }

  async getFriends(): Promise<any> {
    await this.checkSession();
    if (!isCredential(this.info.credential)) {
      throw new Error("credential error");
    }
    return await getFriends({ credential: this.info.credential });
  }

  async addFriend({ targetUserId }: { targetUserId: string }): Promise<any> {
    await this.checkSession();
    if (!isCredential(this.info.credential)) {
      throw new Error("credential error");
    }
    return await addFriend({
      credential: this.info.credential,
      targetUserId,
    });
  }

  async setEventCallback(
    type: "messageReceived",
    callback: (...any: any[]) => any
  ) {
    if (!this.wss) {
      await this.login();
    }
    switch (type) {
      case "messageReceived":
        this.eventCallbacks.messageReceived = callback;
        break;
    }
  }

  async getMessages({
    targetUserId,
    unReadOnly,
    fromTime,
  }: {
    targetUserId?: string;
    unReadOnly?: boolean;
    fromTime?: Date;
  }): Promise<any> {
    await this.checkSession();
    if (!isCredential(this.info.credential)) {
      throw new Error("credential error");
    }
    return await getMessages({
      credential: this.info.credential,
      targetUserId,
      unReadOnly,
      fromTime,
    });
  }

  async sendTextMessage({
    targetUserId,
    message,
  }: {
    targetUserId: string;
    message: string;
  }): Promise<any> {
    await this.checkSession();
    if (!isCredential(this.info.credential)) {
      throw new Error("credential error");
    }
    return await sendTextMessage({
      credential: this.info.credential,
      targetUserId,
      message,
    });
  }

  async markMessageRead({ messageIds }: { messageIds: string[] }) {
    await this.checkSession();
    if (!isCredential(this.info.credential)) {
      throw new Error("credential error");
    }
    return await markMessageRead({
      messageIds,
      credential: this.info.credential,
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
    if (!isCredential(this.info.credential)) {
      throw new Error("credential error");
    }
    return await sendKFC({
      credential: this.info.credential,
      targetUserId,
      amount,
      comment,
    });
  }

  async getUser({ targetUserId }: { targetUserId: string }) {
    await this.checkSession();
    if (!isCredential(this.info.credential)) {
      throw new Error("credential error");
    }
    return getUser({ credential: this.info.credential, targetUserId });
  }
}
