import { getService, Services } from '../../service-factory';
import { ICommand } from '../index';

const rollcall: ICommand = {
  name: ['rollcall'],
  description: 'Organize a rollcall for today',
  isSecret: false,
  command: async (msg) => {
    const rollcallsService = getService(Services.Rollcalls);
    const rollcallService = getService(Services.Rollcall);
    try {
      const todayRollcall = await rollcallsService.startToday(msg.channel.id);
      const messageContent = rollcallService.generateMessageContent(todayRollcall);
      const rollcallMessage = await msg.channel.send(messageContent);
      rollcallService.bindToMessage(todayRollcall, rollcallMessage);
    } catch (e) {
      switch (e.message || e) {
        case 'ROLLCALL_ALREADY_EXISTS':
          msg.channel.send('Cannot start rollcall. A rollcall already exists for today: \n');
          break;
        default:
          msg.channel.send(`Something went wrong :/\n${e}`);
      }
    }
  },
};

export default rollcall;
