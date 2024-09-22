import type { MetaFunction } from "@remix-run/node";
import { MyMessage } from "../components/myMessage";
import { OpponentMessage } from "../components/oponentMessage";

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

const messages = [
  {
    message: "Hello",
    time: "12:00",
    sender: "me",
  },
  {
    message: "Hi",
    time: "12:01",
    sender: "opponent",
  },
  {
    message: "How are you?",
    time: "12:02",
    sender: "me",
  },
  {
    message: "I'm fine",
    time: "12:03",
    sender: "opponent",
  },
  {
    message: "Good to hear",
    time: "12:04",
    sender: "me",
  },
  {
    message: "Yeah",
    time: "12:05",
    sender: "opponent",
  },
] as const satisfies Message[];

export default function Index() {
  return (
    <div className="flex flex-col gap-5">
      {messages.map((message, index) => {
        if (message.sender === "me") {
          return <MyMessage key={index} {...message} />;
        }
        return <OpponentMessage key={index} {...message} />;
      })}
    </div>
  );
}
