import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import socketManager from "./utilities/socketManager";

const app: Application = express();
app.use(cors());
const httpServer = createServer(app);

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
}
export enum ServerEvents {
  NEW_MESSAGE = "newMessage",
}
export interface ServerToClientEvents {
  newMessage: (messages: Message[]) => void;
}

export interface ClientToServerEvents {
  newMessage: (message: string) => void;
}
export interface InterServerEvents {}
export interface SocketData {
  id: string;
  nickname: string;
}

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  /* options */
});

const PORT = process.env.PORT || 8000;

io.on("connection", (socket) => socketManager(io, socket));

httpServer.listen(PORT);
