import { RollcallService } from '../services/rollcall-service';
import { SlashCommandHandler } from '../../../types/command-handler';
import { createOrPullRollcallFromInteraction } from './common/common';

export const rollcallSlashHandler: SlashCommandHandler = async (
  interaction,
) => {
  const rollcallService = await RollcallService.getInstance();
  await createOrPullRollcallFromInteraction(rollcallService, interaction);
};
