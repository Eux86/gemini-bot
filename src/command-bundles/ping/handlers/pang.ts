import { ButtonCommandHandler } from '../../../types/command-handler';

export const pangButtonHandler: ButtonCommandHandler = async (interaction) => {
  if (interaction.isButton()) {
    await interaction.deferReply();
    await interaction.editReply('Pung!');
  }
};
