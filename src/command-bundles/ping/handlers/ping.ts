import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { SlashCommandHandler } from '../../../types/command-handler';

export const pingHandler: SlashCommandHandler = async (interaction) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('pang')
      .setLabel('Pang!')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('pingUpdate')
      .setLabel('update')
      .setStyle(ButtonStyle.Secondary),
  );
  if (interaction.isChatInputCommand()) {
    await interaction.reply({ content: 'pong', components: [row] });
  }
};
