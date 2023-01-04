import { ICommandsBundle } from '../../types/command-handler';
import { hereHandler } from './handlers/here';
import { notHere } from './handlers';
import { rollcallHandler } from './handlers/rollcall';
import { rollcallPullHandler } from './handlers/rollcall-pull';
import { rollcallSlashHandler } from './handlers/rollcall-slash';
import { hereButtonHandler } from './handlers/here-button';
import { notHereButtonHandler } from './handlers/not-here-button';

export const commands: ICommandsBundle = {
  rollcallSlash: {
    type: 'slash',
    name: 'rollcall',
    description: 'Create a rollcall for today in this channel',
    handler: rollcallSlashHandler,
  },
  hereButton: {
    type: 'button',
    name: 'hereButton',
    handler: hereButtonHandler,
  },
  notHereButton: {
    type: 'button',
    name: 'notHereButton',
    handler: notHereButtonHandler,
  },
  here: {
    type: 'prefix',
    commandMatchers: ['here'],
    description: 'Add own participation to current rollcall',
    isSecret: false,
    handler: hereHandler,
  },
  notHere: {
    type: 'prefix',
    commandMatchers: ['not-here'],
    description: 'Remove own participation to current rollcall',
    isSecret: false,
    handler: notHere,
  },
  rollcall: {
    type: 'prefix',
    commandMatchers: ['rollcall'],
    description: 'Organize a rollcall for today',
    isSecret: false,
    handler: rollcallHandler,
  },
  rollcallPull: {
    type: 'prefix',
    commandMatchers: ['rollcall-pull'],
    description: 'Pulls the rollcall message down.',
    isSecret: false,
    handler: rollcallPullHandler,
  },
};
