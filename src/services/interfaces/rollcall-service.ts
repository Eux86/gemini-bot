import { Rollcall } from '../rollcall-service/rollcall';

export interface IRollcallService {
  getAll: (channelName: string) => Rollcall[];

  startToday: (channelName: string) => Rollcall;

  getToday: (channelName: string) => Rollcall | undefined;

  save: () => Promise<void>;
}
