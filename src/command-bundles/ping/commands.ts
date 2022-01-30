import { ICommandsBundle } from '../../types/command-handler';
import { pingHandler } from './ping';

export const commands: ICommandsBundle = {
  ping: {
    commandMatchers: ['ping'],
    description: 'test command to verify if the bot is still alive',
    isSecret: true,
    handler: pingHandler,
  },
};
