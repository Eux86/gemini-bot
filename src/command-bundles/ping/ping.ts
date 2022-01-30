import { CommandHandler } from '../../types/command-handler';

export const pingHandler: CommandHandler = async ({ discordMessage }) => {
  await discordMessage.reply('pong');
  await discordMessage.channel.send('pong');
};
