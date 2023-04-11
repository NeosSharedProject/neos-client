import { apiGetFriends, apiAddFriend } from "./api/friends";
import {
  apiNegotiateHub,
  apiConnectHub,
  sendMessageHub,
  markMessageReadHub,
} from "./api/hub";
import {
  apiGetMessages,
  apiSendTextMessage,
  apiMarkMessageRead,
  apiSendKFC,
} from "./api/messages";
import { apiGetUser, apiGetUserStatus, apiPutUserStatus } from "./api/users";
import { apiDeleteUserSession, apiPostUserSession } from "./api/userSessions";
import { Neos as NeosClient } from "./client";
import {
  NeosDateStringType,
  NeosSessionUrlType,
  NeosUriType,
  NeosVersionType,
} from "./type/common";
import { NeosFriendType } from "./type/friend";
import {
  EventCallbackListType,
  MessagesReadEventArgumentType,
  ReceiveMessageEventArgumentType,
} from "./type/hub";
import {
  NeosGroupIdType,
  NeosIdType,
  NeosMachineIdType,
  NeosMessageIdType,
  NeosOwnerIdType,
  NeosRecordIdType,
  NeosSessionIdType,
  NeosUserIdType,
} from "./type/id";
import {
  CreditTransferMessageContentType,
  CreditTransferMessageType,
  MessageType,
  NeosCreditTransferMessageType,
  NeosMessageType,
  NeosObjectMessageType,
  NeosSessionInviteMessageType,
  NeosSoundMessageType,
  NeosTextMessageType,
  ObjectMessageContentType,
  ObjectMessageType,
  SessionInviteMessageContentType,
  SessionInviteMessageType,
  SoundMessageContentType,
  SoundMessageType,
  TextMessageContentType,
  TextMessageType,
} from "./type/message";
import { NeosSessionType, NeosSessionUserType } from "./type/session";
import { NeosUserStatusType, NeosUserType } from "./type/user";
import {
  NeosLoginCredentialType,
  NeosUserSessionType,
} from "./type/userSession";
import { escapeTagString, neosdb2https } from "./util";
import {
  generateTextMessage,
  getCreditTransferMessageContent,
  getObjectMessageContent,
  getSessionInviteMessageContent,
  getSoundMessageContent,
  parseNeosMessage,
} from "./util/message";
import { getAuthHeader, isPasswordCredential } from "./util/userSession";

export const Neos = NeosClient;
export type Neos = NeosClient;

export const NeosAPI = {
  apiGetFriends,
  apiAddFriend,
  apiGetMessages,
  apiSendTextMessage,
  apiMarkMessageRead,
  apiSendKFC,
  apiGetUser,
  apiGetUserStatus,
  apiPutUserStatus,
  apiPostUserSession,
  apiDeleteUserSession,
};

export const NeosHub = {
  apiNegotiateHub,
  apiConnectHub,
  sendMessageHub,
  markMessageReadHub,
};

export namespace NeosUtil {
  export const Common = {
    escapeTagString,
    neosdb2https,
  };
  export const Message = {
    getObjectMessageContent,
    getCreditTransferMessageContent,
    getSessionInviteMessageContent,
    getSoundMessageContent,
    parseNeosMessage,
    generateTextMessage,
  };
  export const UserSession = {
    getAuthHeader,
    isPasswordCredential,
  };
}

export namespace NeosType {
  //common
  export type NeosDateString = NeosDateStringType;
  export type NeosVersion = NeosVersionType;
  export type NeosUri = NeosUriType;
  export type NeosSessionUrl = NeosSessionUrlType;

  //friend
  export type NeosFriend = NeosFriendType;

  //hub
  export type ReceiveMessageEventArgument = ReceiveMessageEventArgumentType;
  export type MessagesReadEventArgument = MessagesReadEventArgumentType;
  export type EventCallbackList = EventCallbackListType;

  //id
  export type NeosId<T extends string> = NeosIdType<T>;
  export type NeosUserId = NeosUserIdType;
  export type NeosGroupId = NeosGroupIdType;
  export type NeosOwnerId = NeosOwnerIdType;
  export type NeosRecordId = NeosRecordIdType;
  export type NeosMessageId = NeosMessageIdType;
  export type NeosSessionId = NeosSessionIdType;
  export type NeosMachineId = NeosMachineIdType;

  //message
  export type NeosTextMessage = NeosTextMessageType;
  export type NeosObjectMessage = NeosObjectMessageType;
  export type NeosCreditTransferMessage = NeosCreditTransferMessageType;
  export type NeosSessionInviteMessage = NeosSessionInviteMessageType;
  export type NeosSoundMessage = NeosSoundMessageType;
  export type NeosMessage = NeosMessageType;
  export type TextMessageContent = TextMessageContentType;
  export type ObjectMessageContent = ObjectMessageContentType;
  export type CreditTransferMessageContent = CreditTransferMessageContentType;
  export type SessionInviteMessageContent = SessionInviteMessageContentType;
  export type SoundMessageContent = SoundMessageContentType;
  export type TextMessage = TextMessageType;
  export type ObjectMessage = ObjectMessageType;
  export type CreditTransferMessage = CreditTransferMessageType;
  export type SessionInviteMessage = SessionInviteMessageType;
  export type SoundMessage = SoundMessageType;
  export type Message = MessageType;

  //session
  export type NeosSessionUser = NeosSessionUserType;
  export type NeosSession = NeosSessionType;

  //user
  export type NeosUserStatus = NeosUserStatusType;
  export type NeosUser = NeosUserType;

  //userSession
  export type NeosLoginCredential = NeosLoginCredentialType;
  export type NeosUserSession = NeosUserSessionType;
}
