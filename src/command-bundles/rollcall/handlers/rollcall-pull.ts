import { RollcallService } from '../services/rollcall-service';
import { ICommandDescription } from '../../../types/command-handler';

export const rollcallPull: ICommandDescription = {
  commandMatchers: ['rollcall-pull'],
  description: 'Pulls the rollcall message down.',
  isSecret: false,
  handler: async ({
    discordMessage,
  }) => {
    const rollcallService = await RollcallService.getInstance();

    try {
      const todayRollcall = await rollcallService.getToday(discordMessage.channel.id);
      if (!todayRollcall) {
        await discordMessage.channel.send('There is no rollcall for today. Create one first!');
        return;
      }
      const messageContent = rollcallService.generateMessageContent(todayRollcall);
      const rollcallMessage = await discordMessage.channel.send(messageContent);
      if (todayRollcall.messageId) {
        const origMsg = await discordMessage.channel.messages.fetch(todayRollcall.messageId);
        await origMsg.delete();
      }
      await rollcallService.bindToMessage(todayRollcall, rollcallMessage);
      await discordMessage.delete();
    } catch (e) {
      switch (e.message || e) {
        case 'ROLLCALL_ALREADY_EXISTS':
          await discordMessage.channel.send('Cannot start rollcall. A rollcall already exists for today: \n');
          break;
        default:
          await discordMessage.channel.send(`Something went wrong :/\n${e}`);
      }
    }
  },
};
