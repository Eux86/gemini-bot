import { Message } from 'discord.js';

export interface Rollcall {
  readonly participants: readonly string[];

  readonly notParticipants: readonly string[];

  readonly message: Message | undefined;

  readonly date: Date;

  readonly channelName: string | undefined;
}
