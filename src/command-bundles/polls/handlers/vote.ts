import { ICommandHandler } from '../../../types/command-handler';
import { PollsService } from '../services/polls-service';

export const pollVote: ICommandHandler = {
  commandMatchers: ['poll-vote'],
  description: 'Vote an option of the poll',
  isSecret: false,
  handler: async ({
    discordMessage,
    args,
  }) => {
    const service = await PollsService.getInstance();
    const optionIndex = parseInt(args[0], 10);
    const channelName = discordMessage.channel.id;
    const userName = discordMessage.author.username;
    await service.vote(channelName, userName, optionIndex);
    await discordMessage.channel.send(`Vote received ${userName}!`);
    await discordMessage.delete();
  },
};
