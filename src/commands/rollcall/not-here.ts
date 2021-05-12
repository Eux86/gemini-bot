import { getService, Services } from '../../service-factory';
import { ICommand } from '../index';

const notHere: ICommand = {
  name: ['not-here'],
  description: 'Remove own participation to current rollcall',
  isSecret: false,
  command: async (msg) => {
    const rollcallService = getService(Services.Rollcall);
    try {
      const todayRollcall = rollcallService.getToday();
      todayRollcall?.removeParticipant(msg.author.username);
      await todayRollcall?.getMessage()
        ?.edit(todayRollcall?.generateMessageContent());
      await msg.delete({ timeout: 1 });
    } catch (e) {
      switch (e.message || e) {
        case 'NOT_REGISTERED':
          msg.channel.send('You are not registered in today\'s rollcall');
          break;
        case 'Missing Permissions':
          msg.channel.send('I cannot delete messages. Please give me the right permission');
          break;
        default:
          msg.channel.send(`Something went wrong :/\n${e}`);
      }
    }
  },
};

export default notHere;
