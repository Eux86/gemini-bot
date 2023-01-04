import { RollcallService } from '../services/rollcall-service';
import { ButtonCommandHandler } from '../../../types/command-handler';
import { sayNotHere } from './common/common';

export const notHereButtonHandler: ButtonCommandHandler = async (
  interaction,
) => {
  const rollcallService = await RollcallService.getInstance();

  if (!interaction.channel) {
    await interaction.reply('Something went wrong');
    console.error('Could not read the channel');
    return;
  }

  await sayNotHere(
    rollcallService,
    interaction.user.username,
    interaction.channel,
  );
  await interaction.reply({ ephemeral: true, content: 'ok' });
};