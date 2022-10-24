import { RollcallService } from '../services/rollcall-service';
import { PrefixCommandHandler } from '../../../types/command-handler';
import { createRollCallOrPull } from './common/common';
import { RollcallAlreadyExistException } from '../services/errors';

export const rollcallHandler: PrefixCommandHandler = async ({
  discordMessage,
}) => {
  const rollcallService = await RollcallService.getInstance();
  try {
    await createRollCallOrPull(rollcallService, discordMessage.channel);
  } catch (e) {
    if (e instanceof RollcallAlreadyExistException) {
      await discordMessage.channel.send(
        'Cannot start rollcall. A rollcall already exists for today: \n',
      );
    } else {
      console.error(e);
      await discordMessage.channel.send(`Something went wrong :/\n${e}`);
    }
  }
};
