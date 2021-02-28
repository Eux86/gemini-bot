import cheerio from 'cheerio';
import { IMapsInfo } from '../../models/maps-info';
import { IGameServerInfoParser } from '../interfaces/game-server-info-parser';
import { IHttpHelperService } from '../interfaces/http-helper-service';

export class CboxParser implements IGameServerInfoParser {
  httpHelper: IHttpHelperService;

  constructor(httpHelper: IHttpHelperService) {
    this.httpHelper = httpHelper;
  }

  getMapsInfo = async (): Promise<IMapsInfo> => {
    const data = await this.httpHelper.getPageContent('https://combatbox.net/en/');
    const $ = cheerio.load(data);
    const selector = '#main > div > div.dominant_coal';
    const lines = $(selector).first().text().split('\n');
    const currentMapName = /Current Map:(.*),.*/.exec(lines[2])?.[1].trim();
    const nextMapName = /Next Maps:(.*),.*/.exec(lines[3])?.[1].trim();
    const remainingTime = /Current Map:.*,(.*)/.exec(lines[2])?.[1].trim();
    return {
      currentMapName: currentMapName || '',
      nextMapName: nextMapName || '',
      remainingTime: remainingTime || '',
    };
  }
}
