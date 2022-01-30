import { RollcallService } from '../services/rollcall-service';
import { ICommandDescription } from '../../../types/command-handler';

export const notHere: ICommandDescription = {
  commandMatchers: ['not-here'],
  description: 'Remove own participation to current rollcall',
  isSecret: false,
  handler: async ({
    discordMessage,
  }) => {
    const rollcallService = await RollcallService.getInstance();
    try {
      const todayRollcall = await rollcallService.getToday(discordMessage.channel.id);
      if (!todayRollcall) {
        await discordMessage.channel.send('🤦‍ ️Start a rollcall first!');
        return;
      }
      await rollcallService.removeParticipant(todayRollcall, discordMessage.author.username);
      if (todayRollcall.messageId) {
        const rollcallMessage = await discordMessage.channel.messages.fetch(todayRollcall.messageId);
        await rollcallMessage.edit((rollcallService.generateMessageContent(todayRollcall)));
      }
      await discordMessage.delete({ timeout: 1 });
    } catch (e) {
      switch (e.message || e) {
        case 'ALREADY_NOT_REGISTERED':
          await discordMessage.channel.send('You are not registered in today\'s rollcall');
          break;
        case 'Missing Permissions':
          await discordMessage.channel.send('I cannot delete messages. Please give me the right permission');
          break;
        default:
          await discordMessage.channel.send(`Something went wrong :/\n${e}`);
      }
    }
  },
};
