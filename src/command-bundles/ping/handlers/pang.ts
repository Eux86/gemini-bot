import { InteractionHandler } from '../../../types/command-handler';

export const pangButtonHandler: InteractionHandler = async (interaction) => {
  if (interaction.isButton()) {
    await interaction.deferReply();
    await interaction.editReply('Pung!');
  }
};
