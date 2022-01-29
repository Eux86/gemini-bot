import { ICommandHandler } from '../../types/command-handler';

export const ping: ICommandHandler = {
  commandMatchers: ['ping'],
  description: 'test command to verify if the bot is still alive',
  isSecret: true,
  handler: async ({
    discordMessage,
  }) => {
    await discordMessage.reply('pong');
    await discordMessage.channel.send('pong');
  },
};
