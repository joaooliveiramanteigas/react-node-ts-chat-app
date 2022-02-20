export type User = {
  id: string;
  nickname?: string;
};

export type Message = {
  id: string;
  timestamp: number;
  text: string;
  sender: User;
};

export enum ClientEvents {
  NEW_MESSAGE = "newMessage",
  NEW_USER = "newUser",
  NEW_NAME = "newName",

}
export enum ServerEvents {
  NEW_MESSAGE = "newMessage",
  NEW_USER = "newUser",
  LOGOUT = "logout",
}
export interface ServerToClientEvents {
  newMessage: (messages: Message[]) => void;
  newUser: (users: User[]) => void;
  logout: (disconnectedUser: User) => void;
}

export interface ClientToServerEvents {
  newMessage: (message: string) => void;
  newUser: (ack: (user: User) => void) => void;
  newName: (name: string, ack: (message: string) => void) => void;

}
export interface InterServerEvents {}
export interface SocketData {
  id: string;
  nickname: string;
}
