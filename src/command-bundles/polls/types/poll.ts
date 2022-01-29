export interface IVote { userName: string, optionIndex: number}

export interface IPoll {
  messageId: string | undefined;

  date: Date;

  channelName: string | undefined;

  description: string;

  options: string[];

  votes: IVote[]
}
