import { ICommandHandler } from '../../../types/command-handler';

export const hereTest: ICommandHandler = {
  commandMatchers: ['here-test'],
  description: 'outdated',
  isSecret: true,
  handler: async ({
    discordMessage,
  }) => {
    await discordMessage.channel.send('I\'m not in test anymore! Use \'here\' instead :) ');
  },
};
