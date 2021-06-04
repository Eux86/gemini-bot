import { IRollcall } from '../../models/rollcall';

export interface IRollcallRepo {
  set: (rollcalls: IRollcall[]) => Promise<void>;
  get: () => Promise<IRollcall[]>;
}
