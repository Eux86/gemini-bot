import { CommandHandler } from '../../../types/command-handler';
import { PollsService } from '../services/polls-service';
import { handleError } from '../services/errors-handler';
import { pullDiscordMessage } from './common/pull-message';

export const pollPullHandler: CommandHandler = async ({ discordMessage }) => {
  const service = await PollsService.getInstance();
  try {
    const poll = service.getPollByChannel(discordMessage.channel.id);
    await pullDiscordMessage(poll, service, discordMessage.channel);
    await discordMessage.delete();
  } catch (error) {
    await handleError(error as Error, (message) =>
      discordMessage.channel.send(message),
    );
  }
};
