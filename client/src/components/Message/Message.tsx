import { Message as MessageType, User } from "../../types/chat";

type MessageProps = {
  message: MessageType;
  user?: User;
};

const Message = ({ message, user }: MessageProps): JSX.Element => {
  const sender = message.sender.nickname || "Unknown";

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
        <div className={`message`}>{message.text}</div>
      </div>
      <div className="message-info">
        <span>{formatedDate}</span>
        <span>{sender}</span>
      </div>
    </div>
  );
};

export default Message;
