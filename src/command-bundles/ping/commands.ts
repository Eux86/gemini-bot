import { ICommandsBundle } from '../../types/command-handler';
import { pangButtonHandler } from './handlers/pang';
import { pingHandler } from './handlers/ping';

export const commands: ICommandsBundle = {
  ping: {
    commandMatchers: ['ping'],
    description: 'test command to verify if the bot is still alive',
    isSecret: true,
    interactionHandler: pingHandler,
  },
  pang: {
    commandMatchers: ['pang'],
    handler: async () => undefined,
    isSecret: false,
    description: '',
    interactionHandler: pangButtonHandler,
  },
};
