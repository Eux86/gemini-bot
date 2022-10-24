import { PrefixCommandHandler } from '../../../types/command-handler';
import { PollsService } from '../services/polls-service';
import { handleError } from '../services/errors-handler';
import { pullDiscordMessage } from './common/pull-message';

export const pollAddHandler: PrefixCommandHandler = async ({
  discordMessage,
  args,
}) => {
  const service = await PollsService.getInstance();
  const optionDescription = args.join(' ');
  const channelName = discordMessage.channel.id;
  try {
    const poll = await service.addOption(channelName, optionDescription);
    await pullDiscordMessage(poll, service, discordMessage.channel);
  } catch (error) {
    await handleError(error as Error, (message) =>
      discordMessage.channel.send(message),
    );
  }
};
