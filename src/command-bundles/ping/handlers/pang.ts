import { CommandHandler } from '../../../types/command-handler';

export const pangButtonHandler: CommandHandler = async (interaction) => {
  await interaction.reply({ content: 'pang response' });
};
