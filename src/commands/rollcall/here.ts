import { getService, Services } from '../../service-factory';
import { ICommand } from '../index';

const here: ICommand = {
  name: ['here'],
  description: 'Add own participation to current rollcall',
  isSecret: false,
  command: async (msg) => {
    const rollcallService = getService(Services.Rollcall);
    try {
      const todayRollcall = await rollcallService.getToday(msg.channel.id);
      if (!todayRollcall) {
        await msg.channel.send('There is no rollcall yet :/ Start a new rollcall first!');
        return;
      }
      await rollcallService.addParticipant(todayRollcall, msg.author.username);
      // TODO: In case the message got lost, it should create a new one
      if (todayRollcall.messageId) {
        const rollcallMessage = await msg.channel.messages.fetch(todayRollcall.messageId);
        await rollcallMessage.edit((rollcallService.generateMessageContent(todayRollcall)));
      }
      await msg.delete({ timeout: 1 });
    } catch (e) {
      switch (e.message || e) {
        case 'ALREADY_REGISTERED':
          await msg.channel.send('You are alredy registered');
          break;
        case 'Missing Permissions':
          await msg.channel.send('I cannot delete messages. Please give me the right permission');
          break;
        default:
          await msg.channel.send(`Something went wrong :/\n${e}`);
      }
    }
  },
};

export default here;
