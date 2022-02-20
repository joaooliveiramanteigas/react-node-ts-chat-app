import { Server, Socket } from "socket.io";

import { v4 as uuidv4 } from "uuid";
import {
  ClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  Message,
  ServerEvents,
  ServerToClientEvents,
  SocketData,
  User,
} from "../types/socket";

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
  socket.on(ClientEvents.NEW_USER, (ack: (user: User) => void) => {
    const id = uuidv4();
    const defaultNickname = "Unknown";

    const newUser: User = {
      id,
      nickname: defaultNickname,
    };
    socket.data.id = id;
    socket.data.nickname = defaultNickname;

    users.push(newUser);

    // Send the current user to the client
    ack(newUser);
    // Update users to remaining users
    io.emit(ServerEvents.NEW_USER, users);
  });
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

  socket.on(
    ClientEvents.NEW_NAME,
    (value: string, ack: (nickname: string) => void) => {
      const userId = socket.data.id;
      const matchIndex = users.findIndex((u) => u.id === userId);

      if (matchIndex !== -1)
        users[matchIndex] = { ...users[matchIndex], nickname: value };

      ack(value);
      io.emit(ServerEvents.NEW_USER, users);
    }
  );

  socket.on("disconnect", () => {
    if (socket.data.id) {
      const disconnectedUser = users.find((u) => u.id === socket.data.id);

      users = users.filter((u) => socket.data.id !== u.id);

      io.emit(
        ServerEvents.LOGOUT,
        disconnectedUser || {
          id: socket.data.id,
          nickname: socket.data.nickname,
        }
      );
    }
  });
};
