import { Rollcall } from './rollcall';

export class RollcallService {
  private rollcalls: Rollcall[] = [];

  public getAll = () => this.rollcalls;

  public startToday = (channelName: string) => {
    this.cleanOldRollcalls();

    if (this.getToday(channelName)) {
      throw new Error('ROLLCALL_ALREADY_EXISTS');
    }

    const newRollcall = new Rollcall(channelName);
    this.rollcalls.push(newRollcall);
    return newRollcall;
  }

  public getToday = (channelName: string): Rollcall | undefined => this.rollcalls.find((rollcall) =>
    rollcall.date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
    && rollcall.channelName === channelName);

  private cleanOldRollcalls = () => {
    this.rollcalls = this.rollcalls.filter((rc) => this.notInThePast(rc.date));
  }

  private notInThePast = (date: Date) => date.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);
}
