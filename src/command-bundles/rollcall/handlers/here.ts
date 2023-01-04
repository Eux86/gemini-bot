import { RollcallService } from '../services/rollcall-service';
import { PrefixCommandHandler } from '../../../types/command-handler';
import { sayHere } from './common/common';

export const hereHandler: PrefixCommandHandler = async ({ discordMessage }) => {
  const rollcallService = await RollcallService.getInstance();
  await sayHere(
    rollcallService,
    discordMessage.author.username,
    discordMessage.channel,
  );
  await discordMessage.delete();
};
