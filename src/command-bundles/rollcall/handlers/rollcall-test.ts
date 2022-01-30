import { ICommandDescription } from '../../../types/command-handler';

export const rollcallTest: ICommandDescription = {
  commandMatchers: ['rollcall-test'],
  description: 'outdated',
  isSecret: true,
  handler: async ({
    discordMessage,
  }) => {
    await discordMessage.channel.send('I\'m not in test anymore! Use \'rollcall\' instead :) ');
  },
};
