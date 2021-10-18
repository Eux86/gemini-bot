import { ICommandHandler } from '../types/command-handler';

const ping: ICommandHandler = {
  commandMatchers: ['ping'],
  description: 'test command to verify if the bot is still alive',
  isSecret: true,
  handler: ({
    discordMessage,
  }) => {
    discordMessage.reply('pong');
    discordMessage.channel.send('pong');
  },
};

export default ping;
