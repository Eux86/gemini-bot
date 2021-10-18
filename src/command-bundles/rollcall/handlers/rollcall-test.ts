import { ICommandHandler } from '../../../types/command-handler';

export const rollcallTest: ICommandHandler = {
  commandMatchers: ['rollcall-test'],
  description: 'outdated',
  isSecret: true,
  handler: async ({
    discordMessage,
  }) => {
    await discordMessage.channel.send('I\'m not in test anymore! Use \'rollcall\' instead :) ');
  },
};
