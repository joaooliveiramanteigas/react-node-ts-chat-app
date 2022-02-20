export enum MessageCommands {
  NICK = "/nick",
  THINK = "/think",
  OOPS = "/oops",
}

export type Command = {
  isCustomCommand: boolean;
  type: string;
  value: string;
  url: string;
};

export const interpretMessage = (message: string): Command => {
  let actionPayload = {
    isCustomCommand: false,
    type: "",
    value: "",
    url: "",
  };

  if (message.startsWith("/")) {
    const splitString = message.split(" ");
    const command = splitString[0];
    const value = splitString[1];

    switch (command) {
      case MessageCommands.NICK: {
        actionPayload.isCustomCommand = true;
        actionPayload.type = MessageCommands.NICK;
        actionPayload.value = value;
        break;
      }
      case MessageCommands.THINK: {
        actionPayload.isCustomCommand = true;
        actionPayload.type = MessageCommands.THINK;
        actionPayload.value = value;
        break;
      }
      case MessageCommands.OOPS: {
        actionPayload.isCustomCommand = true;
        actionPayload.type = MessageCommands.OOPS;
        break;
      }
      default:
        break;
    }
  }
  return actionPayload;
};
