import { RollcallService } from '../services/rollcall-service';
import { ButtonCommandHandler } from '../../../types/command-handler';
import {
  createRollcallMessage,
  getOrCreateTodayRollcall,
} from './common/common';
import { RollcallUserAlreadyRegisteredException } from '../services/errors';

export const hereButtonHandler: ButtonCommandHandler = async (interaction) => {
  await interaction.deferUpdate();
  const rollcallService = await RollcallService.getInstance();
  if (!interaction.channel) {
    await interaction.reply('Something went wrong');
    console.error('Could not read the channel');
    return;
  }
  try {
    const todayRollcall = await getOrCreateTodayRollcall(
      interaction,
      rollcallService,
    );
    await rollcallService.addParticipant(
      todayRollcall,
      interaction.user.username,
    );
    await interaction.editReply(createRollcallMessage(todayRollcall));
  } catch (e) {
    if (e instanceof RollcallUserAlreadyRegisteredException) {
      await interaction.reply({
        content: "You are already registered in today's rollcall",
        ephemeral: true,
      });
    } else if (e === 'Missing Permissions') {
      await interaction.reply({
        content:
          'I cannot delete messages. Please give me the right permission',
        ephemeral: true,
      });
    } else {
      console.error(e);
      await interaction.reply({
        content: 'Something went wrong :/',
        ephemeral: true,
      });
    }
  }
};
