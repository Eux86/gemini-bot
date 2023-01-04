import { CommandDescription } from '../../../types/command-handler';
import { MapsInfoService } from '../services/maps-info';
import { CboxParser } from '../parsers/cbox-parser';
import { HttpHelper } from '../services/http-helper';

const httpHelperService = new HttpHelper();
const combatBoxParser = new CboxParser(httpHelperService);
const mapsInfoService = new MapsInfoService(combatBoxParser);

export const mapsInfo: CommandDescription = {
  commandMatchers: ['maps'],
  description: 'Returns info about the available servers maps',
  isSecret: false,
  // eslint-disable-next-line no-unused-vars
  handler: async ({ discordMessage }) => {
    const response = await mapsInfoService.getAll();
    discordMessage.channel.send(response);
  },
};
