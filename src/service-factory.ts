import { HttpHelper } from "./services/http-helper";
import { IGameServerInfoParser } from "./services/interfaces/game-server-info-parser";
import { IHttpHelperService } from "./services/interfaces/http-helper-service";
import { IMapsInfoService } from "./services/interfaces/maps-info-service";
import { ISettingsService } from "./services/interfaces/settings-service";
import { MapsInfoService } from "./services/maps-info";
import { CboxParser } from "./services/parsers/cbox-parser";
import { SettingsService } from "./services/settings";

export enum Services {
  Settings = 'settings',
  MapsInfo = 'mapsinfo',
  HttpHelper = 'HttpHelper',
  CombatBoxParser = 'CombatBoxParser',
}

export type ServiceTypeMapping<T> =
  T extends Services.MapsInfo ? IMapsInfoService :
  T extends Services.Settings ? ISettingsService :
  T extends Services.HttpHelper ? IHttpHelperService :
  T extends Services.CombatBoxParser ? IGameServerInfoParser :
  never;

export class ServiceFactory {
  private static instance: ServiceFactory;

  private instances: { [key in Services]?: unknown } = {}

  private constructor() { }

  public static GetInstance = () => {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  };

  public getService = <T extends Services>(serviceIdentifier: T): ServiceTypeMapping<T> => {
    return this.getSingleton(serviceIdentifier);
  }

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
          singleton = new HttpHelper();
          break;
        case Services.CombatBoxParser:
          singleton = new CboxParser(this.getSingleton(Services.HttpHelper));
          break;
      }
      this.instances[serviceIdentifier] = singleton;
    }
    return singleton as ServiceTypeMapping<T>;
  }
}

export const getService = <T extends Services>(serviceIdentifier: T) => ServiceFactory.GetInstance().getService(serviceIdentifier);
