import { Server, Socket } from "socket.io";
import {
  ClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  Message,
  ServerEvents,
  ServerToClientEvents,
  SocketData,
  User,
} from "..";
import { v4 as uuidv4 } from "uuid";

let users: User[] = [];
let messages: Message[] = [];

export default (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  socket.on(ClientEvents.NEW_MESSAGE, (message: string) => {
    const sender = users.find((u) => u.id === socket.data.id) || {
      id: socket.data.id || "",
      nickname: "Unknown",
    };

    const newMessage: Message = {
      id: uuidv4(),
      timestamp: +new Date(),
      text: message,
      sender,
    };

    messages = [...messages, newMessage];

    io.emit(ServerEvents.NEW_MESSAGE, messages);
  });

  socket.on("disconnect", () => {});
};
