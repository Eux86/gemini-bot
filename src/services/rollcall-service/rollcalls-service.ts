import { Rollcall } from './rollcall';
import { getService, Services } from '../../service-factory';
import { IRollcallsService } from '../interfaces/rollcalls-service';
import { RollcallService } from './rollcall-service';

export class RollcallsService implements IRollcallsService {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    // const dbService = getService(Services.Db);
  }

  public startToday = async (channelName: string) => {
    // this.cleanOldRollcalls();

    if (await this.getToday(channelName)) {
      throw new Error('ROLLCALL_ALREADY_EXISTS');
    }

    const manager = new RollcallService();
    const newRollcall = await manager.create(channelName);
    return newRollcall;
  }

  public getToday = async (channelName: string): Promise<Rollcall | undefined> =>
    getService(Services.Db).getRollcallByDateAndChannel(new Date(this.makeToday(new Date())), channelName);

  // private cleanOldRollcalls = () => {
  //   this.rollcalls = this.rollcalls.filter((rc) => this.notInThePast(rc.date));
  // }

  private makeToday = (date: Date) => date.setHours(0, 0, 0, 0);

  private notInThePast = (date: Date) => date.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);
}
