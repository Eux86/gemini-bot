import { RollcallService } from '../services/rollcall-service';
import { CommandHandler } from '../../../types/command-handler';

export const rollcallPullHandler: CommandHandler = async ({
  discordMessage,
}) => {
  const rollcallService = await RollcallService.getInstance();

  try {
    const todayRollcall = await rollcallService.getToday(
      discordMessage.channel.id,
    );
    if (!todayRollcall) {
      await discordMessage.channel.send(
        'There is no rollcall for today. Create one first!',
      );
      return;
    }
    const messageContent =
      rollcallService.generateMessageContent(todayRollcall);
    const rollcallMessage = await discordMessage.channel.send(messageContent);
    if (todayRollcall.messageId) {
      const origMsg = await discordMessage.channel.messages.fetch(
        todayRollcall.messageId,
      );
      await origMsg.delete();
    }
    await rollcallService.bindToMessage(todayRollcall, rollcallMessage);
    await discordMessage.delete();
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
