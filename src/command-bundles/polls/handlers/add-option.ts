import { ICommandHandler } from '../../../types/command-handler';
import { PollsService } from '../services/polls-service';

export const pollAdd: ICommandHandler = {
  commandMatchers: ['poll-add'],
  description: 'Adds an option to the poll in the channel',
  isSecret: false,
  handler: async ({
    discordMessage,
    args,
  }) => {
    const service = await PollsService.getInstance();
    const optionDescription = args.join(' ');
    const channelName = discordMessage.channel.id;
    await service.addOption(channelName, optionDescription);
    await discordMessage.channel.send(service.generatePollMessage(channelName));
  },
};
