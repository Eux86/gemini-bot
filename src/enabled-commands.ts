import { commands as pingBundle } from './command-bundles/ping';
import { commands as rollcallBundle } from './command-bundles/rollcall';
import { commands as ripBundle } from './command-bundles/rip';
import { ICommandsBundle } from './types/command-handler';

export const enabledBundles: ICommandsBundle[] = [
  rollcallBundle,
  pingBundle,
  ripBundle,
  // pollsBundle,
];
