export type User = {
  id: string;
  nickname?: string;
};

export type Message = {
  id: string;
  text: string;
  timestamp: number;
  sender: User;
};
