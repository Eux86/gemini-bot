import { getService, Services } from '../../service-factory';
import { ICommand } from '../index';

const rollcall: ICommand = {
  name: ['rollcall'],
  description: 'Organize a rollcall for today',
  isSecret: false,
  command: async (msg) => {
    const rollcallService = getService(Services.Rollcall);
    try {
      const todayRollcall = await rollcallService.startToday(msg.channel.id);
      const messageContent = rollcallService.generateMessageContent(todayRollcall);
      const rollcallMessage = await msg.channel.send(messageContent);
      await rollcallService.bindToMessage(todayRollcall, rollcallMessage);
    } catch (e) {
      switch (e.message || e) {
        case 'ROLLCALL_ALREADY_EXISTS':
          await msg.channel.send('Cannot start rollcall. A rollcall already exists for today: \n');
          break;
        default:
          await msg.channel.send(`Something went wrong :/\n${e}`);
      }
    }
  },
};

export default rollcall;
