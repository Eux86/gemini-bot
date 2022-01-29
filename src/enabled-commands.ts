import rollcallBundle from './command-bundles/rollcall';
import borguddioBundle from './command-bundles/borguddio';
import ripBundle from './command-bundles/rip';
import mapsInfoBundle from './command-bundles/maps-info';
import * as pollBundle from './command-bundles/polls';

export const commands = [
  ...Object.values(pollBundle),
  ...rollcallBundle,
  ...borguddioBundle,
  ...ripBundle,
  ...mapsInfoBundle,
];
