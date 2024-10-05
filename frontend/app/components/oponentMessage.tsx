import { Icon } from "./icon";
import { MessageArea } from "./messageArea";

type MessageProps = {
  message: string;
  time: string;
};

export const OpponentMessage = (props: MessageProps) => {
  return (
    <div className="flex gap-5 justify-end">
      <Icon />
      <MessageArea {...props} color="bg-slate-200" />
    </div>
  );
};
