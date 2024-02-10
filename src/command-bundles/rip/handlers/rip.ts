import { CommandHandler } from '../../../types/command-handler';
import { tombstoneMaker } from '../tombstone-maker';

export const ripHandler: CommandHandler = async ({ args, reply }) => {
  const epitaph = args.join(' ');
  const tombstone = '```\n' + tombstoneMaker(epitaph) + '\n```';
  await reply({
    content: tombstone,
  });
};
