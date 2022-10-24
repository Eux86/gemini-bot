import { PrefixCommandHandler } from '../../../types/command-handler';
import { PollsService } from '../services/polls-service';
import { handleError } from '../services/errors-handler';

export const pollHandler: PrefixCommandHandler = async ({
  discordMessage,
  args,
}) => {
  const service = await PollsService.getInstance();
  const pollDescription = args.join(' ');
  const channelName = discordMessage.channel.id;
  try {
    const currentPoll = await service.create(channelName, pollDescription);
    const message = await discordMessage.channel.send(
      service.generatePollMessage(channelName),
    );
    await service.bindToMessage(currentPoll, message);
  } catch (error) {
    await handleError(error as Error, (message) =>
      discordMessage.channel.send(message),
    );
  }
};
