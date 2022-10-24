import { ButtonCommandHandler } from '../../../types/command-handler';

export const pingUpdateHandler: ButtonCommandHandler = async (interaction) => {
  if (interaction.isButton()) {
    await interaction.deferUpdate();
    await interaction.editReply('updated?');
  }
};
