import { Rollcall } from './rollcall';

export class RollcallService {
  private rollcalls: Rollcall[] = [];

  public getAll = () => this.rollcalls;

  public startToday = () => {
    this.cleanOldRollcalls();

    if (this.getToday()) {
      throw new Error('ROLLCALL_ALREADY_EXISTS');
    }

    const newRollcall = new Rollcall();
    this.rollcalls.push(newRollcall);
    return newRollcall;
  }

  public getToday = (): Rollcall | undefined => this.rollcalls.find((rollcall) => rollcall.date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0))

  private cleanOldRollcalls = () => {
    this.rollcalls = this.rollcalls.filter((rc) => this.notInThePast(rc.date));
  }

  private notInThePast = (date: Date) => date.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);
}
