import { HttpHelper as HttpHelperService } from './services/http-helper';
import { IGameServerInfoParser } from './services/interfaces/game-server-info-parser';
import { IHttpHelperService } from './services/interfaces/http-helper-service';
import { IMapsInfoService } from './services/interfaces/maps-info-service';
import { ISettingsService } from './services/interfaces/settings-service';
import { MapsInfoService } from './services/maps-info';
import { CboxParser } from './services/parsers/cbox-parser';
import { SettingsService } from './services/settings';
import { IRollcallsService } from './services/interfaces/rollcalls-service';
import { RollcallsService } from './services/rollcall-service/rollcalls-service';
import { IDbService } from './services/interfaces/db-service';
import { DbService } from './services/db/db-service';
import { IRollcallService } from './services/interfaces/rollcall-service';
import { RollcallService } from './services/rollcall-service/rollcall-service';

export enum Services {
  Settings = 'settings',
  MapsInfo = 'mapsinfo',
  HttpHelper = 'HttpHelper',
  CombatBoxParser = 'CombatBoxParser',
  Rollcalls = 'Rollcalls',
  Rollcall = 'Rollcall',
  Db = 'Db',
}

export type ServiceTypeMapping<T> =
  T extends Services.MapsInfo ? IMapsInfoService :
    T extends Services.Settings ? ISettingsService :
      T extends Services.HttpHelper ? IHttpHelperService :
        T extends Services.CombatBoxParser ? IGameServerInfoParser :
          T extends Services.Rollcalls ? IRollcallsService :
            T extends Services.Rollcall ? IRollcallService :
              T extends Services.Db ? IDbService :
                never;

export class ServiceFactory {
  private static instance: ServiceFactory;

  private instances: { [key in Services]?: unknown } = {};

  // eslint-disable-next-line no-useless-constructor,no-empty-function
  private constructor() {
  }

  public static GetInstance = () => {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  };

  public getService = <T extends Services>(serviceIdentifier: T): ServiceTypeMapping<T> => this.getSingleton(serviceIdentifier);

  private getSingleton = <T extends Services>(serviceIdentifier: T): ServiceTypeMapping<T> => {
    let singleton = this.instances[serviceIdentifier];
    if (!singleton) {
      switch (serviceIdentifier) {
        case Services.MapsInfo:
          singleton = new MapsInfoService(this.getSingleton(Services.CombatBoxParser));
          break;
        case Services.Settings:
          singleton = SettingsService.getInstance();
          break;
        case Services.HttpHelper:
          singleton = new HttpHelperService();
          break;
        case Services.CombatBoxParser:
          singleton = new CboxParser(this.getSingleton(Services.HttpHelper));
          break;
        case Services.Rollcalls:
          singleton = new RollcallsService();
          break;
        case Services.Rollcall:
          singleton = new RollcallService();
          break;
        case Services.Db:
          singleton = new DbService();
          break;
        default:
          throw new Error(`No concrete class provided for service${serviceIdentifier}`);
      }
      this.instances[serviceIdentifier] = singleton;
    }
    return singleton as ServiceTypeMapping<T>;
  };
}

export const getService = <T extends Services>(serviceIdentifier: T) => ServiceFactory.GetInstance()
  .getService(serviceIdentifier);
