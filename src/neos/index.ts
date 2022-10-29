import { getFriends, addFriend } from "./api/friends";
import { connectHub } from "./api/hub";
import {
  getMessages,
  sendTextMessage,
  sendKFC,
  markMessageRead,
} from "./api/messages";
import { login, LoginInput } from "./api/session";
import { getUser } from "./api/user";
import { Credential, isCredential, uuidv4 } from "./common";
import WebSocket from "ws";

export type LoginCredential = LoginInput & { secretMachineId: string };

export = class Neos {
  info: {
    login: LoginCredential;
    credential?: Credential;
  };
  wss: WebSocket | undefined;
  eventCallback: ((data: any) => any) | undefined;

  constructor(login: LoginInput) {
    this.info = {
      login: { secretMachineId: uuidv4().replace(/-/g, ""), ...login },
    };
  }

  async login(): Promise<void> {
    this.info.credential = await login(this.info.login);
    this.wss = await connectHub(this.info.credential);
    this.wss.on("message", (buffer) => {
      try {
        const data = JSON.parse(buffer.toString().replace("", ""));
        if (this.eventCallback && data?.type && data.type !== 6) {
          this.eventCallback(data);
        }
      } catch (e) {}
    });
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

  async setEventCallback(callback: (...any: any[]) => any) {
    if (!this.wss) {
      await this.login();
    }
    this.eventCallback = callback;
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
};
