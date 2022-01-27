import { ICommandHandler } from '../../../types/command-handler';
import { PollsService } from '../services/polls-service';

export const poll: ICommandHandler = {
  commandMatchers: ['poll'],
  description: 'Creates a new poll',
  isSecret: false,
  handler: async ({
    discordMessage,
    args,
  }) => {
    const service = await PollsService.getInstance();
    const pollDescription = args[0];
    const channelName = discordMessage.channel.id;
    await service.create(channelName, pollDescription);
    const response = service.generatePollMessage(channelName);
    await discordMessage.channel.send(response);
  },
};
