import { useContext, useEffect, useRef, useState } from "react";
import ChatContext from "../../context/ChatContext";
import { ClientEvents } from "../../types/socket";
import {
  interpretMessage,
  MessageCommands,
  parseSmiles,
} from "../../utilities/methods";
import { socket } from "../../utilities/socket";
import InputWindow from "../InputWindow";
import Message from "../Message";

type ChatProps = {};

// eslint-disable-next-line no-empty-pattern
const Chat = ({}: ChatProps): JSX.Element => {
  const { state, isDisconnected, updateUserNickname } = useContext(ChatContext);

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const shakeElement = () => {
    if (inputRef.current) {
      inputRef.current.className = `${inputRef.current?.className} shake`;

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.className = `input`;
        }
      }, 1000);
    }
  };

  // Scroll chat down if scroll is near the last message sent or bottom of the chat
  const scrollChatDown = () => {
    if (chatWindowRef.current) {
      const maxHeight = chatWindowRef.current.scrollHeight;
      const currentScroll = chatWindowRef.current.scrollTop;
      const isScrollNearBottom = currentScroll + 1000 > maxHeight;

      if (isScrollNearBottom) {
        chatWindowRef.current.scrollTo({
          top: chatWindowRef.current.scrollHeight || 0,
        });
      }
    }
  };
  // Effects
  useEffect(() => {
    scrollChatDown();
  }, [state.messages]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "") {
      state.user && socket.emit(ClientEvents.TYPING, state.user, true);
    } else {
      state.user && socket.emit(ClientEvents.TYPING, state.user, false);
    }

    const parsedSmiles = parseSmiles(event.target.value);

    setInputValue(parsedSmiles);
  };

  const handleSubmit = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    // Shake when empty string
    if (inputValue === "") {
      shakeElement();
      return;
    }

    const specialAction = interpretMessage(inputValue);

    if (!specialAction.isCustomCommand) {
      socket.emit(ClientEvents.NEW_MESSAGE, inputValue);
    } else {
      if (specialAction.type === MessageCommands.NICK) {
        const newNickname = specialAction.value;
        socket.emit(ClientEvents.NEW_NAME, newNickname, (nickname) => {
          updateUserNickname(nickname);
        });
      }

      if (specialAction.type === MessageCommands.THINK) {
        socket.emit(ClientEvents.NEW_MESSAGE, specialAction.value, true);
      }
      if (specialAction.type === MessageCommands.OOPS) {
        socket.emit(ClientEvents.REMOVE_LAST_MESSAGE, state.user);
      }
      if (specialAction.type === MessageCommands.FADE_LAST) {
        socket.emit(ClientEvents.FADE_LAST, state.user);
      }
      if (specialAction.type === MessageCommands.HIGHLIGHT) {
        socket.emit(ClientEvents.NEW_MESSAGE, specialAction.value, false, true);
      }
      if (specialAction.type === MessageCommands.COUNTDOWN) {
        socket.emit(
          ClientEvents.COUNTDOWN,
          Number(specialAction.value),
          specialAction.url,
          state.user
        );
        // No command chosen
      }
      shakeElement();
    }

    setInputValue("");
    state.user && socket.emit(ClientEvents.TYPING, state.user, false);
  };

  if (state.countdown.isActive) {
    if (state.countdown.url !== "")
      setTimeout(
        () => (window.location.href = state.countdown.url),
        state.countdown.time * 1000
      );
  }
  return (
    <main>
      {/* <Debugger chatState={state} /> */}

      <div className="chat-window" ref={chatWindowRef}>
        {!isDisconnected ? (
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
