import { RollcallService } from '../services/rollcall-service';
import { CommandHandler } from '../../../types/command-handler';
import { getOrCreateTodayRollcall } from './common/create-roll-call';

export const hereHandler: CommandHandler = async ({ discordMessage }) => {
  const rollcallService = await RollcallService.getInstance();
  try {
    const todayRollcall = await getOrCreateTodayRollcall(
      discordMessage.channel,
      rollcallService,
    );
    await rollcallService.addParticipant(
      todayRollcall,
      discordMessage.author.username,
    );
    // TODO: In case the message got lost, it should create a new one
    if (todayRollcall.messageId) {
      const rollcallMessage = await discordMessage.channel.messages.fetch(
        todayRollcall.messageId,
      );
      await rollcallMessage.edit(
        rollcallService.generateMessageContent(todayRollcall),
      );
    }
    await discordMessage.delete();
  } catch (e) {
    switch ((e as Error).message || e) {
      case 'ALREADY_REGISTERED':
        await discordMessage.channel.send('You are already registered');
        break;
      case 'Missing Permissions':
        await discordMessage.channel.send(
          'I cannot delete messages. Please give me the right permission',
        );
        break;
      default:
        await discordMessage.channel.send(`Something went wrong :/\n${e}`);
    }
  }
};
