import { PrefixCommandHandler } from '../../../types/command-handler';
import { tombstoneMaker } from '../tombstone-maker';

export const ripHandler: PrefixCommandHandler = async ({
  discordMessage,
  args,
}) => {
  const epitaph = args.join(' ');
  // eslint-disable-next-line
  const tombstone = '```\n' + tombstoneMaker(epitaph) + '\n```';
  discordMessage.channel.send(tombstone);
};
