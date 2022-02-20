import "./styles/index.css";
import { ChatProvider } from "./context/ChatContext";
import Chat from "./components/Chat";

function App() {
  return (
    <ChatProvider>
      <div>
        <header className="chat-header">
          <div className="chat-header-inner">
            <div>
              <h1>Chat Application</h1>
            </div>
          </div>
        </header>

        <Chat />
        {/* <footer>Footer</footer> */}
      </div>
    </ChatProvider>
  );
}

export default App;
