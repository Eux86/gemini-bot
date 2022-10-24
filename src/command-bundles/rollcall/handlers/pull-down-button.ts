import { RollcallService } from '../services/rollcall-service';
import { ButtonCommandHandler } from '../../../types/command-handler';
import { createOrPullRollcallFromInteraction } from './common/common';

export const pullDownButtonHandler: ButtonCommandHandler = async (
  interaction,
) => {
  const rollcallService = await RollcallService.getInstance();
  await createOrPullRollcallFromInteraction(rollcallService, interaction);
};