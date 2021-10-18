import ping from './ping';
import { mapsInfo } from '../command-bundles/maps-info/handlers';
import { borguddio } from '../command-bundles/borguddio/handlers';
import * as RollcallCommands from '../command-bundles/rollcall';

export default [
  ...RollcallCommands as any,
  ping,
  mapsInfo,
  borguddio,
];
