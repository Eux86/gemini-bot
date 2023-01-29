import { RollcallService } from '../services/rollcall-service';
import { SlashCommandHandler } from '../../../types/command-handler';
import { createOrPullRollcall } from './common/common';

export const rollcallSlashHandler: SlashCommandHandler = async (
  interaction,
) => {
  const rollcallService = await RollcallService.getInstance();
  await createOrPullRollcall(rollcallService, interaction);
};
