import { ICommand } from '../index';

const rollcallTest: ICommand = {
  name: ['rollcall-test'],
  description: 'outdated',
  isSecret: true,
  command: async (msg) => {
    msg.channel.send('I\'m not in test anymore! Use \'rollcall\' instead :) ');
  },
};

export default rollcallTest;
