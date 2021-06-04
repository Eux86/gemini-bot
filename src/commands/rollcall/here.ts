import { getService, Services } from '../../service-factory';
import { ICommand } from '../index';

const here: ICommand = {
  name: ['here'],
  description: 'Add own participation to current rollcall',
  isSecret: false,
  command: async (msg) => {
    const rollcallsService = getService(Services.Rollcalls);
    const rollcallService = getService(Services.Rollcall);
    try {
      const todayRollcall = await rollcallsService.getToday(msg.channel.id);
      if (!todayRollcall) {
        msg.channel.send('There is no rollcall yet :/ Start a new rollcall first!');
        return;
      }
      rollcallService.addParticipant(todayRollcall, msg.author.username);
      await todayRollcall?.message?.edit((rollcallService.generateMessageContent(todayRollcall)));
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
