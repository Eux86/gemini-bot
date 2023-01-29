import { RollcallService } from '../services/rollcall-service';
import { ButtonCommandHandler } from '../../../types/command-handler';
import {
  createRollcallMessage,
  getOrCreateTodayRollcall,
} from './common/common';
import { RollcallUserAlreadyNotRegisteredException } from '../services/errors';

export const notHereButtonHandler: ButtonCommandHandler = async (
  interaction,
) => {
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
    await rollcallService.removeParticipant(
      todayRollcall,
      interaction.user.username,
    );
    await interaction.deferUpdate();
    await interaction.editReply(createRollcallMessage(todayRollcall));
  } catch (e) {
    if (e instanceof RollcallUserAlreadyNotRegisteredException) {
      await interaction.reply({
        content: "You are not registered in today's rollcall",
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
