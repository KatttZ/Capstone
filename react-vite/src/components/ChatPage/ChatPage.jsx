
import { useState } from "react";


export default function ChatPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");


  return (
    <div>
      <h2>Enter the Chat Room</h2>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <input
          type="text"
          placeholder="Room code (to join)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button >Join Room</button>
      </div>
      <button >Create Room</button>
    </div>
  );
}
