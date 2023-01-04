import { RollcallService } from '../services/rollcall-service';
import { PrefixCommandHandler } from '../../../types/command-handler';
import { createRollCallOrPull } from './common/common';

export const rollcallPullHandler: PrefixCommandHandler = async ({
  discordMessage,
}) => {
  const rollcallService = await RollcallService.getInstance();

  await createRollCallOrPull(rollcallService, discordMessage.channel);
  await discordMessage.delete();
};
