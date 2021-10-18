import { IMapsInfo } from './maps-info';

export interface IGameServerInfoParser {
  getMapsInfo: () => Promise<IMapsInfo>;
}
