import { ChatState } from "../../context/ChatContext";

type DebuggerProps = {
  chatState: ChatState;
};

const Debugger = ({ chatState }: DebuggerProps): JSX.Element => {
  return (
    <div>
      {chatState.users.length > 0 && (
        <ul>
          {chatState.users.map((u) => (
            <li key={u.id}>{JSON.stringify(u, null, 2)}</li>
          ))}
        </ul>
      )}
      {chatState.messages.length > 0 && (
        <ul>
          {chatState.messages.map((m) => (
            <li key={m.id}>{JSON.stringify(m, null, 2)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Debugger;
