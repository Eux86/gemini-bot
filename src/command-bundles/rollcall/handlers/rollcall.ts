import { RollcallService } from '../services/rollcall-service';
import { CommandHandler } from '../../../types/command-handler';
import { Message } from 'discord.js';

export const createRollCall = async (rollcallService: RollcallService, discordMessage: Message) => {
  const todayRollcall = await rollcallService.startToday(
    discordMessage.channel.id,
  );
  const messageContent =
    rollcallService.generateMessageContent(todayRollcall);
  const rollcallMessage = await discordMessage.channel.send(messageContent);
  await rollcallService.bindToMessage(todayRollcall, rollcallMessage);
}

export const rollcallHandler: CommandHandler = async ({ discordMessage }) => {
  const rollcallService = await RollcallService.getInstance();
  try {
    await createRollCall(rollcallService, discordMessage);
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
