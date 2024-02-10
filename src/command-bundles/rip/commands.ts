import { ICommandsBundle } from '../../types/command-handler';
import { ripHandler } from './handlers/rip';

export const commands: ICommandsBundle = {
  rip: {
    type: 'slash',
    name: 'rip',
    description: 'put your chosen words on a respectful tombstone',
    handler: ripHandler,
  },
};
