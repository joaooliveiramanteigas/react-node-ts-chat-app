import { useReducer, createContext, Dispatch } from "react";
import { Message as MessageType, User } from "../types/chat";

export enum ChatActionTypes {
  REPLACE_USERS = "REPLACE_USERS",
  REPLACE_MESSAGES = "REPLACE_MESSAGES",
  ADD_MESSAGE = "ADD_MESSAGE",
  UPDATE_USER = "UPDATE_USER",
}

export type ChatActionPayload = {
  users?: User[];
  message?: MessageType;
  messages?: MessageType[];
  user?: User;
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
    case ChatActionTypes.REPLACE_MESSAGES: {
      return { ...state, messages: action.payload?.messages || [] };
    }

    default:
      return state;
  }
};

type ContextProps = {
  state: ChatState;
  dispatch: Dispatch<ChatAction>;
};

const contextInitialState: ContextProps = {
  state: initialState,
  dispatch: () => null,
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

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
