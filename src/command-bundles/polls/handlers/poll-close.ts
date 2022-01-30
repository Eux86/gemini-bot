import { CommandHandler } from '../../../types/command-handler';
import { PollsService } from '../services/polls-service';
import { handleError } from '../services/errors-handler';
import { pullDiscordMessage } from './common/pull-message';

export const pollClosHandler: CommandHandler = async ({ discordMessage }) => {
  const service = await PollsService.getInstance();
  const channelName = discordMessage.channel.id;
  try {
    const poll = await service.close(channelName);
    await pullDiscordMessage(poll, service, discordMessage.channel);
  } catch (error) {
    await handleError(error as Error, (message) =>
      discordMessage.channel.send(message),
    );
  }
};
