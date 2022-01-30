import { RollcallService } from '../services/rollcall-service';
import { ICommandDescription } from '../../../types/command-handler';

export const here: ICommandDescription = {
  commandMatchers: ['here'],
  description: 'Add own participation to current rollcall',
  isSecret: false,
  handler: async ({
    discordMessage,
  }) => {
    const rollcallService = await RollcallService.getInstance();
    try {
      const todayRollcall = await rollcallService.getToday(discordMessage.channel.id);
      if (!todayRollcall) {
        await discordMessage.channel.send('There is no rollcall yet :/ Start a new rollcall first!');
        return;
      }
      await rollcallService.addParticipant(todayRollcall, discordMessage.author.username);
      // TODO: In case the message got lost, it should create a new one
      if (todayRollcall.messageId) {
        const rollcallMessage = await discordMessage.channel.messages.fetch(todayRollcall.messageId);
        await rollcallMessage.edit((rollcallService.generateMessageContent(todayRollcall)));
      }
      await discordMessage.delete({ timeout: 1 });
    } catch (e) {
      switch (e.message || e) {
        case 'ALREADY_REGISTERED':
          await discordMessage.channel.send('You are alredy registered');
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
