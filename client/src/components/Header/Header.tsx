import { useContext } from "react";
import ChatContext from "../../context/ChatContext";

type HeaderProps = {};

// eslint-disable-next-line no-empty-pattern
const Header = ({}: HeaderProps): JSX.Element => {
  const { state } = useContext(ChatContext);

  const username =
    state.users.length > 0
      ? state.users.filter((u) => u.id !== state.user?.id).length > 0
        ? state.users.filter((u) => u.id !== state.user?.id)[0].nickname
        : "Unknown"
      : "Unknown";

  return (
    <header className="chat-header">
      <div className="chat-header-inner">
        <div>
          <h1>Chat Application</h1>
        </div>
        <div>
          <h2>{state.isTyping ? "typing" : username}</h2>
        </div>
      </div>
    </header>
  );
};

export default Header;
