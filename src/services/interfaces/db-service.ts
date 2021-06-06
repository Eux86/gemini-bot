import { IRollcall } from '../../models/rollcall';

export interface IRollcallRepo {
  set: (rollcalls: IRollcall[]) => Promise<void>;
  get: () => Promise<IRollcall[]>;

  saveRollcall: (rollcall: IRollcall) => Promise<void>;
  deleteRollcall: (rollcall: IRollcall) => Promise<void>;
  getRollcallByDateAndChannel: (date: Date, channelName: string) => Promise<IRollcall | undefined>;
}

