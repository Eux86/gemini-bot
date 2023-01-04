import { RollcallService } from '../services/rollcall-service';
import { ButtonCommandHandler } from '../../../types/command-handler';
import { sayHere } from './common/common';

export const hereButtonHandler: ButtonCommandHandler = async (interaction) => {
  const rollcallService = await RollcallService.getInstance();
  if (!interaction.channel) {
    await interaction.reply('Something went wrong');
    console.error('Could not read the channel');
    return;
  }
  await sayHere(
    rollcallService,
    interaction.user.username,
    interaction.channel,
  );
  // await interaction.reply({ ephemeral: true, content: 'ok' });
};
