import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import socketManager from "./utilities/socketManager";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types/socket";

const app: Application = express();
app.use(cors());
const httpServer = createServer(app);

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
