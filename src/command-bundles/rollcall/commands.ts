import { ICommandsBundle } from '../../types/command-handler';
import { rollcallSlashHandler } from './handlers/rollcall-slash';
import { hereButtonHandler } from './handlers/here-button';
import { notHereButtonHandler } from './handlers/not-here-button';
import { pullDownButtonHandler } from './handlers/pull-down-button';

export const commands: ICommandsBundle = {
  pullDownButton: {
    type: 'button',
    name: 'pullDownButton',
    handler: pullDownButtonHandler,
  },
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
};
