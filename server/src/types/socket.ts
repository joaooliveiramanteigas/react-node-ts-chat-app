import { Message, User } from "./chat";

export enum ClientEvents {
  NEW_MESSAGE = "newMessage",
  NEW_USER = "newUser",
  NEW_NAME = "newName",
  TYPING = "typing",
  REMOVE_LAST_MESSAGE = "removeLastMessage",
  FADE_LAST = "fadeLast",
  COUNTDOWN = "countdown",
}
export enum ServerEvents {
  NEW_MESSAGE = "newMessage",
  NEW_USER = "newUser",
  LOGOUT = "logout",
  TYPING = "typing",
  COUNTDOWN = "countdown",
}
export interface ServerToClientEvents {
  newMessage: (messages: Message[]) => void;
  newUser: (users: User[]) => void;
  logout: (disconnectedUser: User) => void;
  typing: (user: User, isTyping: boolean) => void;
  countdown: (time: number, url: string, user?: User) => void;
}

export interface ClientToServerEvents {
  newMessage: (
    message: string,
    isThinking?: boolean,
    isHighlighted?: boolean
  ) => void;
  newUser: (ack: (user: User) => void) => void;
  newName: (name: string, ack: (message: string) => void) => void;
  typing: (user: User, isTyping: boolean) => void;
  removeLastMessage: (user?: User) => void;
  fadeLast: (user?: User) => void;
  countdown: (time: number, url: string, user?: User) => void;
}
export interface InterServerEvents {}
export interface SocketData {
  id: string;
  nickname: string;
}
