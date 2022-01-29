import { ICommandHandler } from '../../../types/command-handler';
import { PollsService } from '../services/polls-service';

export const pollClose: ICommandHandler = {
  commandMatchers: ['poll-close'],
  description: 'Closes the current poll and shows the results',
  isSecret: false,
  handler: async ({
    discordMessage,
  }) => {
    const service = await PollsService.getInstance();
    const channelName = discordMessage.channel.id;
    const resultMessage = await service.closeAndGetResultsMessage(channelName);
    await discordMessage.channel.send(resultMessage);
  },
};
