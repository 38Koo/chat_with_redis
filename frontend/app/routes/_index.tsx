import { type MetaFunction } from "@remix-run/node";
import { MyMessage } from "../components/myMessage";
import { OpponentMessage } from "../components/oponentMessage";
import { InputMessageArea } from "../components/inputMessageArea";
import { useEffect, useState } from "react";

type Sender = "me" | "opponent";
type Message = {
  message: string;
  time: string;
  sender: Sender;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const convertToMessage = (jsonStr: string) => {
    const parsed = JSON.parse(jsonStr);
    return {
      message: parsed.text,
      time: new Date().toLocaleTimeString(),
      sender: Math.random() > 0.5 ? "me" : "opponent",
    } as Message;
  };

  useEffect(() => {
    // WebSocketの接続を確立
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      console.log("Message received from server:", event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        convertToMessage(event.data),
      ]);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // WebSocketのインスタンスを保存
    setSocket(ws);

    // コンポーネントがアンマウントされるときにWebSocketを閉じる
    return () => {
      ws.close();
    };
  }, []);

  console.log(messages);

  return (
    <>
      <div className="flex flex-col gap-5">
        {messages.map((message, index) => {
          if (message.sender === "me") {
            return <MyMessage key={index} {...message} />;
          }
          return <OpponentMessage key={index} {...message} />;
        })}
      </div>
      <InputMessageArea socket={socket} />
    </>
  );
}
