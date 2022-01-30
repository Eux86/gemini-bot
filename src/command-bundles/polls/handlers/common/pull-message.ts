import { DMChannel, NewsChannel, TextChannel } from 'discord.js';
import { IPoll } from '../../types/poll';
import { IPollsServce } from '../../types/polls-service';

export const pullDiscordMessage = async (
  poll: IPoll,
  pollService: IPollsServce,
  channel: TextChannel | DMChannel | NewsChannel,
) => {
  const messageContent = pollService.generatePollMessage(channel.id);
  const pollMessage = await channel.send(messageContent);
  if (poll.messageId) {
    const origMsg = await channel.messages.fetch(poll.messageId);
    await origMsg.delete();
  }
  await pollService.bindToMessage(poll, pollMessage);
};
