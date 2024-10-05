type MessageProps = {
  message: string;
  time: string;
  color: "bg-gray-400" | "bg-slate-200";
};

export const MessageArea = ({ message, time, color }: MessageProps) => {
  return (
    <div className={`rounded-md p-2 ${color}`}>
      <div className="w-auto h-auto">{message}</div>
      <div>{time}</div>
    </div>
  );
};
