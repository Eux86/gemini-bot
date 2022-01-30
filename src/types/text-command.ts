import { Message } from 'discord.js';

export interface ITextCommand {
  name: string;
  args: string[];
  discordMessage: Message;
}
