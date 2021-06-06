import { getService, Services } from '../../service-factory';
import { ICommand } from '../index';

const rollcallPull: ICommand = {
  name: ['rollcall-pull'],
  description: 'Pulls the rollcall message down.',
  isSecret: false,
  command: async (msg) => {
    const rollcallService = getService(Services.Rollcall);
    try {
      const todayRollcall = await rollcallService.getToday(msg.channel.id);
      if (!todayRollcall) {
        await msg.channel.send('There is no rollcall for today. Create one first!');
        return;
      }
      const messageContent = rollcallService.generateMessageContent(todayRollcall);
      const rollcallMessage = await msg.channel.send(messageContent);
      if (todayRollcall.messageId) {
        const origMsg = await msg.channel.messages.fetch(todayRollcall.messageId);
        await origMsg.delete();
      }
      await rollcallService.bindToMessage(todayRollcall, rollcallMessage);
      await msg.delete();
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

export default rollcallPull;
