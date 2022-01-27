import { ICommandDescription } from '../../../types/command-handler';
import { tombstoneMaker } from '../tombstone-maker';

export const rip: ICommandDescription = {
  commandMatchers: ['rip'],
  description: 'put your chosen words on a respectful tombstone',
  isSecret: true,
  handler: ({
    discordMessage,
    args,
  }) => {
    const epitaph = args.join(' ');
    // eslint-disable-next-line
    const tombstone = "```\n"+tombstoneMaker(epitaph)+"\n```";
    discordMessage.channel.send(tombstone);
  },
};
