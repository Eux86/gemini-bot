import { ICommand } from '.';

const ping: ICommand = {
  name: ['ping'],
  description: 'test command to verify if the bot is still alive',
  isSecret: true,
  command: (msg: any) => {
    msg.reply('pong');
    msg.channel.send('pong');
  },
};

export default ping;
