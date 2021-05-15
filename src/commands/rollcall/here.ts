import { getService, Services } from '../../service-factory';
import { ICommand } from '../index';

const here: ICommand = {
  name: ['here-test'],
  description: 'Add own participation to current rollcall',
  isSecret: false,
  command: async (msg) => {
    const rollcallService = getService(Services.Rollcall);
    try {
      const todayRollcall = rollcallService.getToday(msg.channel.id);
      todayRollcall?.addParticipant(msg.author.username);
      await todayRollcall?.getMessage()
        ?.edit(todayRollcall?.generateMessageContent());
      await msg.delete({ timeout: 1 });
    } catch (e) {
      switch (e.message || e) {
        case 'ALREADY_REGISTERED':
          msg.channel.send('You are alredy registered');
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

export default here;
