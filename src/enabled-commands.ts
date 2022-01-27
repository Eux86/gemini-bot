import rollcallBundle from './command-bundles/rollcall';
import borguddioBundle from './command-bundles/borguddio';
import ripBundle from './command-bundles/rip';
import mapsInfoBundle from './command-bundles/maps-info';
import * as pollBundle from './command-bundles/polls';
import * as pingBundle from './command-bundles/ping';
import { ICommandDescription } from './types/command-handler';

export const commands: ICommandDescription[] = [
  ...Object.values(pollBundle.commands),
  ...Object.values(pingBundle),
  ...rollcallBundle,
  ...borguddioBundle,
  ...ripBundle,
  ...mapsInfoBundle,
];
