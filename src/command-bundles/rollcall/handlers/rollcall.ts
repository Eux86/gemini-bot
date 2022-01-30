import { RollcallService } from '../services/rollcall-service';
import { ICommandDescription } from '../../../types/command-handler';

export const rollcall: ICommandDescription = {
  commandMatchers: ['rollcall'],
  description: 'Organize a rollcall for today',
  isSecret: false,
  handler: async ({
    discordMessage,
  }) => {
    const rollcallService = await RollcallService.getInstance();

    try {
      const todayRollcall = await rollcallService.startToday(discordMessage.channel.id);
      const messageContent = rollcallService.generateMessageContent(todayRollcall);
      const rollcallMessage = await discordMessage.channel.send(messageContent);
      await rollcallService.bindToMessage(todayRollcall, rollcallMessage);
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
