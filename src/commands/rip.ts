import { ICommand } from '.';

const rip: ICommand = {
  name: ['rip'],
  description: 'put your chosen words on a respectful tombstone',
  isSecret: true,
  command: (msg, args) => {
    const epitaph = args.join(' ');
    const tombstone = `tombstone: -- ${epitaph} --`;
    msg.channel.send(tombstone);
  },
};

export default rip;
