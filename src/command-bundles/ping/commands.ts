import { ICommandsBundle } from '../../types/command-handler';
import { pangButtonHandler } from './handlers/pang';
import { pingHandler } from './handlers/ping';

export const commands: ICommandsBundle = {
  ping: {
    type: 'slash',
    name: 'ping',
    description: 'test command to verify if the bot is still alive',
    handler: pingHandler,
  },
  pang: {
    type: 'button',
    name: 'pang',
    handler: pangButtonHandler,
  },
};
