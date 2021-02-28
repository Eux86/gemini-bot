import { IMapsInfo } from "../../models/maps-info";

export interface IGameServerInfoParser {
  getMapsInfo: () => Promise<IMapsInfo>;
}