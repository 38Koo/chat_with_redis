type MessageProps = {
  message: string;
  time: string;
};

export const MessageArea = ({ message, time }: MessageProps) => {
  return (
    <div className="bg-slate-400 rounded-md p-2">
      <div className="w-auto h-auto ">{message}</div>
      <div>{time}</div>
    </div>
  );
};
