import { IMapsInfoService } from "../models/maps-info-service";

export class MapsInfoService implements IMapsInfoService {
  getAll = () => `
CBOX
---------
Current map: A bridge too far
Time remaining: 3:00
  `;
}