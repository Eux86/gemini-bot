import { ICommand } from ".";

const ping: ICommand = {
  name: 'ping',
  description: 'test command to verify if the bot is still alive',
  command: (msg: any, args: any) => {
      msg.reply('pong');
      msg.channel.send('pong');
  },
};

export default ping;