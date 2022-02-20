import { useRef } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { Message as MessageType, User } from "../../types/chat";

type MessageProps = {
  message: MessageType;
  user?: User;
};

const Message = ({ message, user }: MessageProps): JSX.Element => {
  const messageRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersectionObserver(messageRef, { threshold: 0.7 });
  const isVisible = !!intersection?.isIntersecting;

  const sender = message.sender.nickname || "Unknown";

  const isSender = message.sender.id === user?.id;

  const date = new Date(message.timestamp);
  const formatedDate = `${date.getHours()}:${date.getMinutes()}`;

  const { isThinking, isFaded, isHighlighted } = message;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        ...(isFaded && { opacity: "0.1" }),
      }}
      ref={messageRef}
    >
      <div className="message-block">
        <div
          className={`message ${isVisible && "show"}`}
          style={{
            float: `${isSender ? "right" : "left"}`,
            backgroundColor: `${isSender ? "#BFE3B4" : "#0047AB"}`,
            ...(isThinking && { color: "darkgray" }),
            ...(isHighlighted && {
              fontSize: "1.65rem",
              backgroundColor: `${isSender ? "#b3d59a" : "#087596"}`,
            }),
          }}
        >
          {message.text}
        </div>
      </div>
      <div
        className="message-info"
        style={{
          justifyContent: `${isSender ? "flex-end" : "flex-start"}`,
        }}
      >
        <span>{formatedDate}</span>
        <span>{sender}</span>
      </div>
    </div>
  );
};

export default Message;
