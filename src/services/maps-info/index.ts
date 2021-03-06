import { IGameServerInfoParser } from '../interfaces/game-server-info-parser';
import { IMapsInfoService } from '../interfaces/maps-info-service';

export class MapsInfoService implements IMapsInfoService {
  combatBoxParser: IGameServerInfoParser;

  constructor(combatBoxParser: IGameServerInfoParser) {
    this.combatBoxParser = combatBoxParser;
  }

  getAll = async (): Promise<string> => {
    const cboxInfo = await this.combatBoxParser.getMapsInfo();
    return `
Combat Box:
------------
Current map:         ${cboxInfo.currentMapName}
Next map:              ${cboxInfo.nextMapName}
Remaining Time:  ${cboxInfo.remainingTime}
------------

    `;
  };
}
