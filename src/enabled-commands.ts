import rollcallBundle from './command-bundles/rollcall';
import borguddioBundle from './command-bundles/borguddio';
import ripBundle from './command-bundles/rip';
import mapsInfoBundle from './command-bundles/maps-info';

export default [
  ...rollcallBundle,
  ...borguddioBundle,
  ...ripBundle,
  ...mapsInfoBundle,
];
