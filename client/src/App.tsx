import { useRef, useState } from "react";
import InputWindow from "./components/InputWindow";
import Message from "./components/Message";
import "./styles/index.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = false;
  return (
    <div>
      <header className="chat-header">
        <div className="chat-header-inner">
          <div>
            <h1>Chat Application</h1>
          </div>
        </div>
      </header>
      <main>
        {/* <Debugger chatState={state} /> */}

        <div className="chat-window">
          {isLoading ? (
            <div className="loading-container">
              <h1 style={{ textAlign: "center" }}>
                Send a message to start chatting
              </h1>
              <div className="loading" />
            </div>
          ) : (
            <Message
              message={{
                id: "a",
                text: "Ola",
                sender: { id: "", nickname: "" },
                timestamp: +new Date(),
              }}
            />
          )}
        </div>
        <InputWindow
          inputRef={inputRef}
          handleSubmit={(e) => null}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
      </main>
    </div>
  );
}

export default App;
