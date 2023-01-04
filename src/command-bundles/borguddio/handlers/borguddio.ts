import { CommandDescription } from '../../../types/command-handler';

export const borguddio: CommandDescription = {
  commandMatchers: [
    'borguddio',
    'porcoddio',
    'porcodio',
    'porco*io',
    'porco',
    'dioporco',
    'dio',
  ],
  description: 'Returns info about the available servers maps',
  isSecret: true,
  // eslint-disable-next-line no-unused-vars
  handler: async ({ name, discordMessage, args }) => {
    if (
      (name === 'porco' && ['dio', '*io'].includes(args[0])) ||
      (name === 'dio' && args[0] === 'porco')
    ) {
      discordMessage.channel.send(':BORGUDDIO:');
    }
  },
};
