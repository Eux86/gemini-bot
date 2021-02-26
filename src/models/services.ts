import { IMapsInfoService } from "./maps-info-service";
import { ISettingsService } from "./settings-service";

export interface IServices {
  settingsService: ISettingsService;
  currentMapsInfoService: IMapsInfoService;
}