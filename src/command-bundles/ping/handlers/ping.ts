import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { SlashCommandHandler } from '../../../types/command-handler';

export const pingHandler: SlashCommandHandler = async (interaction) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('pang')
      .setLabel('Pang!')
      .setStyle(ButtonStyle.Primary),
  );
  if (interaction.isChatInputCommand()) {
    await interaction.reply({ content: 'pong', components: [row as any] });
  }
};
