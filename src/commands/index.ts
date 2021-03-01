import ping from './ping';
import { ISettingsService } from '../services/interfaces/settings-service';
import mapsInfo from './maps-info';
import borguddio from './borguddio';

interface ICommand {
  name: string[];
  isSecret: boolean;
  description: string;
  command: (msg: string, args: any, settingsService: ISettingsService) => void;
}

export { ICommand };
export default [ping, mapsInfo, borguddio];
