import { Message } from 'discord.js';

export interface IRollcall {
  participants: string[];

  notParticipants: string[];

  message: Message | undefined;

  date: Date;

  channelName: string | undefined;
}
