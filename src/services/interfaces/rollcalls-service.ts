import { Rollcall } from '../../models/rollcall';

export interface IRollcallsService {
  startToday: (channelName: string) => Promise<Rollcall>;

  getToday: (channelName: string) => Promise<Rollcall | undefined>;
}
