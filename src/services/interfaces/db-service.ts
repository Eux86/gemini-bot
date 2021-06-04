import { Rollcall } from '../rollcall-service/rollcall';

export interface IDbService {
  saveRollcall: (rollcall: Rollcall) => Promise<void>;
  deleteRollcall: (rollcall: Rollcall) => Promise<void>;
  getRollcallByDateAndChannel: (date: Date, channelName: string) => Promise<Rollcall | undefined>;
}

