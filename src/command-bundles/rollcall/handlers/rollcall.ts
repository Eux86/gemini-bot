import { RollcallService } from '../services/rollcall-service';
import { CommandHandler } from '../../../types/command-handler';
import { createRollCall } from './common/create-roll-call';

export const rollcallHandler: CommandHandler = async ({ discordMessage }) => {
  const rollcallService = await RollcallService.getInstance();
  try {
    await createRollCall(rollcallService, discordMessage.channel);
  } catch (e) {
    switch ((e as Error).message || e) {
      case 'ROLLCALL_ALREADY_EXISTS':
        await discordMessage.channel.send(
          'Cannot start rollcall. A rollcall already exists for today: \n',
        );
        break;
      default:
        await discordMessage.channel.send(`Something went wrong :/\n${e}`);
    }
  }
};
