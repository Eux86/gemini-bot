import { commands as rollcallBundle } from './command-bundles/rollcall';
import { commands as ripBundle } from './command-bundles/rip';
import { commands as pingBundle } from './command-bundles/ping';
import { commands as pollsBundle } from './command-bundles/polls';
import { ICommandsBundle } from './types/command-handler';

export const enabledBundles: ICommandsBundle[] = [
  rollcallBundle,
  pingBundle,
  pollsBundle,
  ripBundle,
];
