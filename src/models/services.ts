import { IMapsInfoService } from '../services/interfaces/maps-info-service';
import { ISettingsService } from '../services/interfaces/settings-service';

export interface IServices {
  settingsService: ISettingsService;
  currentMapsInfoService: IMapsInfoService;
}