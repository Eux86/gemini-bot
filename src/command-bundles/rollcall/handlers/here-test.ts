import { ICommandDescription } from '../../../types/command-handler';

export const hereTest: ICommandDescription = {
  commandMatchers: ['here-test'],
  description: 'outdated',
  isSecret: true,
  handler: async ({
    discordMessage,
  }) => {
    await discordMessage.channel.send('I\'m not in test anymore! Use \'here\' instead :) ');
  },
};
