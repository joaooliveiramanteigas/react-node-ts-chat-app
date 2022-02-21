import { useReducer, createContext, useState, useEffect } from "react";
import { Message as MessageType, User } from "../types/chat";
import { ClientEvents, ServerEvents } from "../types/socket";
import { socket } from "../utilities/socket";

export enum ChatActionTypes {
  REPLACE_USERS = "REPLACE_USERS",
  REPLACE_MESSAGES = "REPLACE_MESSAGES",
  ADD_MESSAGE = "ADD_MESSAGE",
  UPDATE_USER = "UPDATE_USER",
  REMOVE_USER = "REMOVE_USER",
  UPDATE_USER_NICKNAME = "UPDATE_USER_NICKNAME",
  UPDATE_TYPING = "UPDATE_TYPING",
  COUNTDOWN = "COUNTDOWN",
}

export type ChatActionPayload = {
  users?: User[];
  message?: MessageType;
  messages?: MessageType[];
  user?: User;
  nickname?: string;
  isTyping?: boolean;
  time?: number;
  url?: string;
};

export type ChatAction = {
  type: ChatActionTypes;
  payload?: ChatActionPayload;
};

export type ChatState = {
  user: User | undefined;
  users: User[];
  messages: MessageType[];
  isTyping: boolean;
  countdown: { isActive: boolean; time: number; url: string };
};
/**
 * Initial State
 */

/**
 * Reducer
 */

export const initialState: ChatState = {
  user: undefined,
  users: [],
  messages: [],
  isTyping: false,
  countdown: { isActive: false, time: 0, url: "" },
};

export const chatReducer = (
  state: ChatState,
  action: ChatAction
): ChatState => {
  switch (action.type) {
    case ChatActionTypes.ADD_MESSAGE: {
      return {
        ...state,
        messages: [
          ...state.messages,
          ...[action.payload?.message || ({} as MessageType)],
        ],
      };
    }
    case ChatActionTypes.REPLACE_USERS: {
      const users = action.payload?.users || [];
      return {
        ...state,
        users,
      };
    }
    case ChatActionTypes.REPLACE_MESSAGES: {
      return { ...state, messages: action.payload?.messages || [] };
    }
    case ChatActionTypes.UPDATE_USER: {
      return { ...state, user: action.payload?.user };
    }
    case ChatActionTypes.REMOVE_USER: {
      const users = state.users.filter(
        (u) => u.id !== action.payload?.user?.id
      );
      return { ...state, users };
    }
    case ChatActionTypes.UPDATE_USER_NICKNAME: {
      return {
        ...state,
        user: { id: state.user?.id || "", nickname: action.payload?.nickname },
      };
    }
    case ChatActionTypes.UPDATE_TYPING: {
      const isSelfWriter = state.user?.id === action.payload?.user?.id;
      return {
        ...state,
        ...(!isSelfWriter && {
          isTyping: action.payload?.isTyping || false,
        }),
      };
    }
    case ChatActionTypes.COUNTDOWN: {
      const isCountdownSender = state.user?.id === action.payload?.user?.id;
      const countdown = {
        isActive: !isCountdownSender,
        time: action.payload?.time || 0,
        url: action.payload?.url || "",
      };
      return {
        ...state,
        countdown,
      };
    }
    default:
      return state;
  }
};

type ContextProps = {
  state: ChatState;
  isDisconnected: boolean;
  updateUserNickname: (nickname: string) => void;
};

const contextInitialState: ContextProps = {
  state: initialState,
  isDisconnected: false,
  updateUserNickname: () => null,
};

const ChatContext = createContext<ContextProps>(contextInitialState);

/**
 * Provider
 */

export const ChatProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [isDisconnected, setIsDisconnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {});

    socket.emit(ClientEvents.NEW_USER, (currentUser: User) => {
      dispatch({
        type: ChatActionTypes.UPDATE_USER,
        payload: { user: currentUser },
      });
    });
    socket.on(ServerEvents.NEW_USER, (users: User[]) => {
      dispatch({ type: ChatActionTypes.REPLACE_USERS, payload: { users } });
    });

    socket.on(ServerEvents.NEW_MESSAGE, (messages: MessageType[]) => {
      dispatch({
        type: ChatActionTypes.REPLACE_MESSAGES,
        payload: { messages },
      });
    });

    socket.on(ServerEvents.TYPING, (user: User, isTyping: boolean) => {
      dispatch({
        type: ChatActionTypes.UPDATE_TYPING,
        payload: { user, isTyping },
      });
    });

    socket.on(
      ServerEvents.COUNTDOWN,
      (time: number, url: string, user?: User) => {
        dispatch({
          type: ChatActionTypes.COUNTDOWN,
          payload: { user, time, url },
        });
      }
    );

    socket.on(ServerEvents.LOGOUT, (disconnectedUser: User) => {
      dispatch({
        type: ChatActionTypes.REMOVE_USER,
        payload: { user: disconnectedUser },
      });
    });

    return () => {
      socket.disconnect();
      setIsDisconnected(true);
    };
  }, [dispatch]);

  const updateUserNickname = (nickname: string) => {
    dispatch({
      type: ChatActionTypes.UPDATE_USER_NICKNAME,
      payload: { nickname },
    });
  };
  return (
    <ChatContext.Provider value={{ state, isDisconnected, updateUserNickname }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
