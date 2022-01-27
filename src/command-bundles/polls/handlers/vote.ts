/* eslint-disable no-console */
import { CommandHandler } from '../../../types/command-handler';
import { PollsService } from '../services/polls-service';
import { handleError } from '../services/errors-handler';
import { pullDiscordMessage } from './common/pull-message';

export const pollVoteHandler: CommandHandler = async ({
  discordMessage,
  args,
}) => {
  const service = await PollsService.getInstance();
  const optionIndex = parseInt(args[0], 10);
  const channelName = discordMessage.channel.id;
  const userName = discordMessage.author.username;
  try {
    const poll = await service.vote(channelName, userName, optionIndex);
    await pullDiscordMessage(poll, service, discordMessage.channel);
    await discordMessage.delete();
  } catch (error) {
    await handleError(error, (message) => discordMessage.channel.send(message));
  }
};
