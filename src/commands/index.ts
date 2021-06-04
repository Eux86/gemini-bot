import { Message } from 'discord.js';
import ping from './ping';
import { ISettingsService } from '../services/interfaces/settings-service';
import mapsInfo from './maps-info';
import borguddio from './borguddio';
import rollcall from './rollcall/rollcall';
import here from './rollcall/here';
import notHere from './rollcall/not-here';
import hereTest from './rollcall/here-test';
import rollcallTest from './rollcall/rollcall-test';

interface ICommand {
  name: string[];
  isSecret: boolean;
  description: string;
  command: (msg: Message, args: any, settingsService: ISettingsService) => void;
}

export { ICommand };
export default [ping, mapsInfo, borguddio, rollcall, here, notHere, hereTest, rollcallTest];
