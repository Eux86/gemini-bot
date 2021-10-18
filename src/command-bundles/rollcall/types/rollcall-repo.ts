import { IRollcall } from './rollcall';

export interface IRollcallRepo {
  set: (rollcalls: IRollcall[]) => Promise<void>;
  get: () => Promise<IRollcall[] | undefined>;
}
