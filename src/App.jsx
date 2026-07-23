import { useEffect, useState } from "react";
import { socket } from "./socket";
import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMessage(msg) {
      setMessages((prev) => [...prev, msg]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.disconnect();
    };
  }, []);

  function sendMessage() {
    socket.emit("message", "hello from client");
  }

  return (
    <div>
      <p>Status: {isConnected ? "🟢 connected" : "🔴 disconnected"}</p>
      <button onClick={sendMessage}>Send message</button>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
