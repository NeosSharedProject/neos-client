import { getFriends, addFriend } from "./api/friends";
import {
  getMessages,
  sendTextMessage,
  sendKFC,
  markMessageRead,
} from "./api/messages";
import { login } from "./api/session";
import { getUser } from "./api/user";
import { Credential, isCredential, uuidv4 } from "./common";

export = class Neos {
  info: {
    username: string;
    password: string;
    secretMachineId: string;
    credential?: Credential;
  };

  constructor(username: string, password: string) {
    this.info = { username, password, secretMachineId: uuidv4() };
  }

  async login(): Promise<void> {
    this.info.credential = await login({
      username: this.info.username,
      password: this.info.password,
      secretMachineId: this.info.secretMachineId,
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
