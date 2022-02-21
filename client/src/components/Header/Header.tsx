import { useContext } from "react";
import ChatContext from "../../context/ChatContext";
import { User } from "../../types/chat";

type HeaderProps = {};

const removeUser = (userToRemove?: User) => (user: User) =>
  userToRemove?.id !== user.id;

// eslint-disable-next-line no-empty-pattern
const Header = ({}: HeaderProps): JSX.Element => {
  const {
    state: { isTyping, users, user },
  } = useContext(ChatContext);

  const remainingUsers = users.filter(removeUser(user));

  const username =
    (remainingUsers.length > 0 && remainingUsers[0].nickname) || "Unknown";

  return (
    <header className={"chat-header"}>
      <div className="chat-header-inner">
        <div>
          <h1>Chat Application</h1>
        </div>
        <div>
          <h2>{isTyping ? "typing..." : username}</h2>
        </div>
      </div>
    </header>
  );
};

export default Header;
