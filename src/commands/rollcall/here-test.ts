import { ICommand } from '../index';

const hereTest: ICommand = {
  name: ['here-test'],
  description: 'outdated',
  isSecret: true,
  command: async (msg) => {
    msg.channel.send('I\'m not in test anymore! Use \'here\' instead :) ');
  },
};

export default hereTest;
