import { Icon } from "./icon";
import { MessageArea } from "./messageArea";

type MessageProps = {
  message: string;
  time: string;
};

export const MyMessage = (props: MessageProps) => {
  return (
    <div className="flex gap-5">
      <Icon />
      <MessageArea {...props} />
    </div>
  );
};
