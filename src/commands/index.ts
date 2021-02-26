import ping from './ping';
import { ISettingsService } from "../models/settings-service";
import mapsInfo from './maps-info';

interface ICommand {
  name: string;
  description: string;
  command: (msg: string, args: any, settingsService: ISettingsService) => void;
}

export { ICommand };
export default [ping, mapsInfo];