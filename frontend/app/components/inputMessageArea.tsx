import React, { useState } from "react";

type InputMessageAreaProps = {
  socket: WebSocket | null;
};

export const InputMessageArea = ({ socket }: InputMessageAreaProps) => {
  const [message, setMessage] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    console.log(e);
    e.preventDefault();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ text: message }));
      console.log("Message sent:", message);
      setMessage("");
    } else {
      console.error(
        "WebSocket connection is not open. ReadyState:",
        socket?.readyState
      );
    }
  };

  return (
    <div>
      <form onSubmit={sendMessage} method="POST">
        <input
          name="input"
          className="border-2 border-gray-300"
          placeholder="Type a message..."
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Send!
        </button>
      </form>
    </div>
  );
};
