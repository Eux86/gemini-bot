import { RollcallService } from '../services/rollcall-service';
import { SlashCommandHandler } from '../../../types/command-handler';
import { createRollCallOrPull } from './common/common';

export const rollcallSlashHandler: SlashCommandHandler = async (
  interaction,
) => {
  const rollcallService = await RollcallService.getInstance();
  try {
    if (!interaction.channel) throw new Error('No channel in message');
    await createRollCallOrPull(rollcallService, interaction.channel);
  } catch (e) {
    console.error(e);
    await interaction.reply(`Something went wrong :/\n${e}`);
  }
};
