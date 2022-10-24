import { RollcallService } from '../services/rollcall-service';
import { PrefixCommandHandler } from '../../../types/command-handler';
import {
  createRollcallMessage,
  getOrCreateTodayRollcall,
} from './common/common';
import { RollcallUserAlreadyRegisteredException } from '../services/errors';

export const hereHandler: PrefixCommandHandler = async ({ discordMessage }) => {
  const rollcallService = await RollcallService.getInstance();
  if (!discordMessage.channel) {
    await discordMessage.reply('Something went wrong');
    console.error('Could not read the channel');
    return;
  }
  try {
    const todayRollcall = await getOrCreateTodayRollcall(
      discordMessage.channel,
      rollcallService,
    );
    await rollcallService.addParticipant(
      todayRollcall,
      discordMessage.author.username,
    );
    await discordMessage.reply(createRollcallMessage(todayRollcall));
  } catch (e) {
    if (e instanceof RollcallUserAlreadyRegisteredException) {
      await discordMessage.reply({
        content: "You are already registered in today's rollcall",
      });
    } else if (e === 'Missing Permissions') {
      await discordMessage.reply({
        content:
          'I cannot delete messages. Please give me the right permission',
      });
    } else {
      console.error(e);
      await discordMessage.reply({
        content: 'Something went wrong :/',
      });
    }
  }
};
