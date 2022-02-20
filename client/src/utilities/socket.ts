import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types/socket";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:8000/"
);

export { socket };
