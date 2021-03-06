import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { Message, User } from "../types/chat";
import {
  ClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  ServerEvents,
  ServerToClientEvents,
  SocketData,
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
  socket.on(
    ClientEvents.NEW_MESSAGE,
    (message: string, isThinking?: boolean, isHighlighted?: boolean) => {
      const sender = users.find((u) => u.id === socket.data.id) || {
        id: socket.data.id || "",
        nickname: "Unknown",
      };

      const newMessage: Message = {
        id: uuidv4(),
        timestamp: +new Date(),
        text: message,
        sender,
        isThinking: !!isThinking,
        isFaded: false,
        isHighlighted: !!isHighlighted,
      };

      messages = [...messages, newMessage];

      io.emit(ServerEvents.NEW_MESSAGE, messages);
    }
  );

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

  socket.on(ClientEvents.TYPING, (user: User, isTyping: boolean) => {
    io.emit(ServerEvents.TYPING, user, isTyping);
  });

  socket.on(ClientEvents.REMOVE_LAST_MESSAGE, (user?: User) => {
    if (!user) return;
    const lastMessageSentByUser = messages
      .filter((m) => m.sender.id === user.id)
      .sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1;
        if (a.timestamp < b.timestamp) return 1;
        return 0;
      })[0];
    const messageIndexToBeRemoved = messages.findIndex(
      (m) => m.id === lastMessageSentByUser.id
    );

    if (messageIndexToBeRemoved >= 0) {
      messages.splice(messageIndexToBeRemoved, 1);

      io.emit(ServerEvents.NEW_MESSAGE, messages);
    }
  });

  socket.on(ClientEvents.FADE_LAST, (user?: User) => {
    if (!user) return;
    const lastMessageSentByUser = messages
      .filter((m) => m.sender.id === user.id)
      .sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1;
        if (a.timestamp < b.timestamp) return 1;
        return 0;
      })[0];
    const messageIndexToBeFaded = messages.findIndex(
      (m) => m.id === lastMessageSentByUser.id
    );

    if (messageIndexToBeFaded >= 0) {
      messages[messageIndexToBeFaded] = {
        ...messages[messageIndexToBeFaded],
        isFaded: true,
      };

      io.emit(ServerEvents.NEW_MESSAGE, messages);
    }
  });

  socket.on(
    ClientEvents.COUNTDOWN,
    (time: number, url: string, user?: User) => {
      io.emit(ServerEvents.COUNTDOWN, time, url, user);
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
