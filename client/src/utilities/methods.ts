export enum MessageCommands {
  NICK = "/nick",
  THINK = "/think",
  OOPS = "/oops",
  FADE_LAST = "/fadelast",
  HIGHLIGHT = "/highlight",
  COUNTDOWN = "/countdown",
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
    const url = splitString[2];

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
      case MessageCommands.FADE_LAST: {
        actionPayload.isCustomCommand = true;
        actionPayload.type = MessageCommands.FADE_LAST;
        break;
      }
      case MessageCommands.HIGHLIGHT: {
        actionPayload.isCustomCommand = true;
        actionPayload.type = MessageCommands.HIGHLIGHT;
        actionPayload.value = value;
        break;
      }
      case MessageCommands.COUNTDOWN: {
        actionPayload.isCustomCommand = true;
        actionPayload.type = MessageCommands.COUNTDOWN;
        actionPayload.value = value;
        actionPayload.url = url;
        break;
      }
      default:
        break;
    }
  }
  return actionPayload;
};

enum SmileCommands {
  SMILE = "(smile)",
  WINK = "(wink)",
}
enum SmileValues {
  SMILE = "🙂",
  WINK = "😉",
}

export const parseSmiles = (value: string): string => {
  let parseSmiles = value;
  if (value.includes(SmileCommands.SMILE)) {
    parseSmiles = parseSmiles.replaceAll(
      SmileCommands.SMILE,
      SmileValues.SMILE
    );
  }

  if (value.includes(SmileCommands.WINK)) {
    parseSmiles = parseSmiles.replaceAll(SmileCommands.WINK, SmileValues.WINK);
  }
  return parseSmiles;
};
