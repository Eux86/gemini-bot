import { ICommand } from '.';

const borguddio: ICommand = {
  name: ['borguddio', 'porcoddio', 'porcodio', 'porco*io', 'porco', 'dioporco', 'dio'],
  description: 'Returns info about the available servers maps',
  isSecret: true,
  // eslint-disable-next-line no-unused-vars
  command: async (msg: any, args: any) => {
    if ((msg !== 'porco' || ['dio', '*io'].includes(args[0])) || (msg === 'dio' && args[0] === 'porco')) {
      msg.channel.send(':BORGUDDIO:');
    }
  },
};

export default borguddio;
