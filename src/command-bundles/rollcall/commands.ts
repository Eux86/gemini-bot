import { ICommandsBundle } from '../../types/command-handler';
import { hereHandler } from './handlers/here';
import { notHere } from './handlers';
import { rollcallHandler } from './handlers/rollcall';
import { rollcallPullHandler } from './handlers/rollcall-pull';

export const commands: ICommandsBundle = {
  here: {
    commandMatchers: ['here'],
    description: 'Add own participation to current rollcall',
    isSecret: false,
    handler: hereHandler,
  },
  notHere: {
    commandMatchers: ['not-here'],
    description: 'Remove own participation to current rollcall',
    isSecret: false,
    handler: notHere,
  },
  rollcall: {
    commandMatchers: ['rollcall'],
    description: 'Organize a rollcall for today',
    isSecret: false,
    handler: rollcallHandler,
  },
  rollcallPull: {
    commandMatchers: ['rollcall-pull'],
    description: 'Pulls the rollcall message down.',
    isSecret: false,
    handler: rollcallPullHandler,
  },
};
