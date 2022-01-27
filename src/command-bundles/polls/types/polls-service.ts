import { Message } from 'discord.js';
import { IPoll } from './poll';

export interface IPollsServce {
  create: (channelName: string, description: string, options: string[]) => Promise<IPoll>;

  addOption: (channelName: string, description: string) => Promise<IPoll>;

  bindToMessage: (poll: IPoll, message: Message) => Promise<IPoll>;

  generatePollMessage: (channelName: string) => string;

  close: (channelName: string) => Promise<IPoll>;

  vote: (channelName: string, userName: string, optionIndex: number) => Promise<IPoll>;

  getPollByChannel: (channelName: string) => IPoll;
}
