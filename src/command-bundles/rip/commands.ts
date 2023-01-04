import { ICommandsBundle } from '../../types/command-handler';
import { ripHandler } from './handlers/rip';

export const commands: ICommandsBundle = {
  rip: {
    type: 'prefix',
    commandMatchers: ['rip'],
    description: 'put your chosen words on a respectful tombstone',
    isSecret: true,
    handler: ripHandler,
  },
};
