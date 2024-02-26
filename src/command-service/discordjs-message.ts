import { IMessage } from './command-service.interface';
import { DiscordJsChannel } from './discordjs-channel';
import { Message } from 'discord.js';

export class DiscordJsMessage implements IMessage {
  id: string;

  channel: DiscordJsChannel | undefined;

  constructor(private message: Message) {
    this.id = message.id;
    this.channel = message.channelId
      ? new DiscordJsChannel(message.channel)
      : undefined;
  }

  async edit(content: string): Promise<IMessage> {
    const sentMessage = await this.message.edit({
      content,
    });
    return new DiscordJsMessage(sentMessage);
  }

  async delete(): Promise<void> {
    await this.message.delete();
  }
}
