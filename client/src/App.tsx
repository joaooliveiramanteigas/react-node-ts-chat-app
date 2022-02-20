import "./styles/index.css";

function App() {
  const isLoading = true;
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
          {isLoading && (
            <div className="loading-container">
              <h1 style={{ textAlign: "center" }}>
                Send a message to start chatting
              </h1>
              <div className="loading" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
