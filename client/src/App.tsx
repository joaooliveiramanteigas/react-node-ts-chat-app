import "./styles/index.css";
import { ChatProvider } from "./context/ChatContext";
import Chat from "./components/Chat";
import Header from "./components/Header";

function App() {
  return (
    <ChatProvider>
      <div>
        <Header />

        <Chat />
        {/* <footer>Footer</footer> */}
      </div>
    </ChatProvider>
  );
}

export default App;
