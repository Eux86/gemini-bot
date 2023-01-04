import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { InteractionHandler } from '../../../types/command-handler';

export const pingHandler: InteractionHandler = async (interaction) => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('pang')
      .setLabel('Pang!')
      .setStyle(ButtonStyle.Primary),
  );
  if (interaction.isChatInputCommand()) {
    await interaction.reply({ content: 'pong', components: [row as any] });
  }
};
