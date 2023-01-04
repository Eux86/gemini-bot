import { PrefixCommandHandler } from '../../../types/command-handler';
import { PollsService } from '../services/polls-service';
import { pullDiscordMessage } from './common/pull-message';
import { handleError } from '../services/errors-handler';

export const pollVoteRemoveHandler: PrefixCommandHandler = async ({
  discordMessage,
  args,
}) => {
  const service = await PollsService.getInstance();
  const optionIndex = parseInt(args[0], 10);
  const channelName = discordMessage.channel.id;
  const userName = discordMessage.author.username;
  try {
    const poll = await service.unVote(channelName, userName, optionIndex);
    await pullDiscordMessage(poll, service, discordMessage.channel);
    await discordMessage.delete();
  } catch (error) {
    await handleError(error as Error, (message) =>
      discordMessage.channel.send(message),
    );
  }
};
