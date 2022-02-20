import { useContext, useEffect, useRef, useState } from "react";
import ChatContext, { ChatActionTypes } from "../../context/ChatContext";
import { Message as MessageType, User } from "../../types/chat";
import { ClientEvents, ServerEvents } from "../../types/socket";
import { socket } from "../../utilities/socket";
import InputWindow from "../InputWindow";
import Message from "../Message";

type ChatProps = {};

// eslint-disable-next-line no-empty-pattern
const Chat = ({}: ChatProps): JSX.Element => {
  const { state, dispatch } = useContext(ChatContext);
  const [hasDisconnected, setHasDisconnected] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

    return () => {
      socket.disconnect();
      setHasDisconnected(true);
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    if (inputValue === "") {
      if (inputRef.current) {
        inputRef.current.className = `${inputRef.current?.className} shake`;

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.className = `input`;
          }
        }, 1000);
      }
      return;
    }
    socket.emit(ClientEvents.NEW_MESSAGE, inputValue);

    setInputValue("");
  };
  return (
    <main>
      {/* <Debugger chatState={state} /> */}

      <div className="chat-window">
        {!hasDisconnected ? (
          state.messages.length === 0 ? (
            <div className="loading-container">
              <h1 style={{ textAlign: "center" }}>
                Send a message to start chatting
              </h1>
              <div className="loading" />
            </div>
          ) : (
            <>
              {state.messages.map((m) => (
                <Message key={m.id} message={m} user={state.user} />
              ))}
            </>
          )
        ) : (
          <div>Disconnected</div>
        )}
      </div>
      <InputWindow
        inputRef={inputRef}
        handleSubmit={handleSubmit}
        onChange={handleChange}
        value={inputValue}
      />
    </main>
  );
};

export default Chat;