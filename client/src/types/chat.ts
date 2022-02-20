export type User = {
  id: string;
  nickname?: string;
};

export type Message = {
  id: string;
  timestamp: number;
  text: string;
  sender: User;
  isThinking: boolean;
  isFaded: boolean;
  isHighlighted: boolean;
};
