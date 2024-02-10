import { IChannel, IMessage } from './command-service.interface';
import { BaseInteraction } from 'discord.js';
import { DiscordJsMessage } from './discordjs-message';
import { MessageNotFoundException } from '../command-bundles/rollcall/handlers/common/exceptions';

type Channel = BaseInteraction['channel'];
export class DiscordJsChannel implements IChannel {
  id: string;

  constructor(private channel: NonNullable<Channel>) {
    this.id = channel.id;
  }

  async getMessage(id: string): Promise<IMessage> {
    try {
      const message = await this.channel.messages.fetch(id);
      return new DiscordJsMessage(message);
    } catch (error) {
      console.error('getMessage error', error);
      throw new MessageNotFoundException();
    }
  }
}
