import { Message } from 'discord.js';
import { IPoll } from './poll';

export interface IPollsServce {
  create: (channelName: string, description: string, options: string[]) => Promise<IPoll>;

  addOption: (channelName: string, description: string) => Promise<IPoll>;

  bindToMessage: (poll: IPoll, message: Message) => Promise<void>;

  generatePollMessage: (channelName: string) => string;

  closeAndGetResultsMessage: (channelName: string) => Promise<string>;

  vote: (channelName: string, userName: string, optionIndex: number) => Promise<void>;
}
