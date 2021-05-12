import { Rollcall } from '../rollcall-service/rollcall';

export interface IRollcallService {
  getAll: () => Rollcall[];

  startToday: () => Rollcall;

  getToday: () => Rollcall | undefined;
}
