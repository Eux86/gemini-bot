import { IMapsInfoService } from "./models/maps-info-service";
import { ISettingsService } from "./models/settings-service";
import { MapsInfoService } from "./services/maps-info";
import { SettingsService } from "./services/settings";

export enum Services {
  Settings = 'settings',
  MapsInfo = 'mapsinfo',
}

export type ServiceTypeMapping<T> =
  T extends Services.MapsInfo ? IMapsInfoService :
    T extends Services.Settings ? ISettingsService :
      never;

export class ServiceFactory {
  private static instance: ServiceFactory;

  private instances: { [key in Services]?: unknown } = {}

  private constructor() {

  }

  public static GetInstance = () => {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  };

  public getService = <T extends Services>(serviceIdentifier: T): ServiceTypeMapping<T>  => {
    return this.getSingleton(serviceIdentifier);
  }

  private getSingleton = <T extends Services>(serviceIdentifier: T): ServiceTypeMapping<T> => {
    let singleton = this.instances[serviceIdentifier];
    if (!singleton) {
      switch(serviceIdentifier) {
        case Services.MapsInfo: 
          singleton = new MapsInfoService();
          break;
        case Services.Settings:
          singleton = SettingsService.getInstance();
          break;
      }
      this.instances[serviceIdentifier] = singleton;
    }
    return singleton as ServiceTypeMapping<T>;
  }
}

export const getService = <T extends Services>(serviceIdentifier: T) => ServiceFactory.GetInstance().getService(serviceIdentifier);
