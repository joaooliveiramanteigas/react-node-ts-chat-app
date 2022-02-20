import { Message as MessageType, User } from "../../types/chat";

type MessageProps = {
  message: MessageType;
  user?: User;
};

const Message = ({ message, user }: MessageProps): JSX.Element => {
  const sender = message.sender.nickname || "Unknown";

  const isSender = message.sender.id === user?.id;

  const date = new Date(message.timestamp);
  const formatedDate = `${date.getHours()}:${date.getMinutes()}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="message-block">
        <div
          className={`message`}
          style={{
            float: `${isSender ? "right" : "left"}`,
            backgroundColor: `${isSender ? "#BFE3B4" : "#0047AB"}`,
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
