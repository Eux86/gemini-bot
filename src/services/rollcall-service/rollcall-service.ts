/* eslint-disable no-param-reassign */
import { Message } from 'discord.js';
import { IRollcall } from '../../models/rollcall';
import { IRollcallService } from '../interfaces/rollcall-service';
import { IRollcallRepo } from '../interfaces/db-service';

export class RollcallService implements IRollcallService {
  private rollcalls: IRollcall[] = [];

  private repo: IRollcallRepo;

  private initPromise?: Promise<void>;

  constructor(repo: IRollcallRepo) {
    this.repo = repo;
    this.init();
  }

  private init = async () => {
    if (!this.initPromise) {
      this.initPromise = new Promise((resolve) => {
        this.repo.get().then((rollcalls) => {
          this.rollcalls = rollcalls;
          resolve();
        });
      });
    }
    return this.initPromise;
  }

  public generateMessageContent = (rollcall: IRollcall) => `
Rollcall started. 
Join using .here.
Remove your presence using .not-here.

${rollcall.participants.length} present${rollcall.participants.length > 1 ? 's' : ''}: ${rollcall.participants.join(', ')}
${rollcall.notParticipants.length} NOT present${rollcall.participants.length > 1 ? 's' : ''}: ${rollcall.notParticipants.join(', ')}
`;

  public startToday = async (channelName: string) => {
    await this.init();
    await this.cleanOldRollcalls();

    if (await this.getToday(channelName)) {
      throw new Error('ROLLCALL_ALREADY_EXISTS');
    }

    const newRollcall = await this.create(channelName);
    this.rollcalls.push(newRollcall);
    this.repo.set(this.rollcalls);
    return newRollcall;
  }

  public getToday = async (channelName: string): Promise<IRollcall | undefined> => {
    await this.init();
    return this.rollcalls.find((rollcall) =>
      rollcall.date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
      && rollcall.channelName === channelName);
  };

  private cleanOldRollcalls = async () => {
    await this.init();
    this.rollcalls = this.rollcalls.filter((rc) => this.notInThePast(rc.date));
  }

  private makeToday = (date: Date) => date.setHours(0, 0, 0, 0);

  private notInThePast = (date: Date) => date.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);

  public create = async (channelName: string) => ({
    participants: [],
    notParticipants: [],
    channelName,
    message: undefined,
    date: new Date(),
  })

  public addParticipant = async (rollcall: IRollcall, name: string) => {
    await this.init();
    rollcall.notParticipants = rollcall.notParticipants.filter((participant) => participant !== name);
    if (rollcall.participants.find((registered) => registered === name)) {
      throw new Error('ALREADY_REGISTERED');
    }
    rollcall.participants.push(name);
    await this.repo.set(this.rollcalls);
  };

  public removeParticipant = async (rollcall: IRollcall, name: string) => {
    rollcall.participants = rollcall.participants.filter((participant) => participant !== name);
    if (rollcall.notParticipants.find((registered) => registered === name)) {
      throw new Error('ALREADY_NOT_REGISTERED');
    }
    rollcall.notParticipants.push(name);
    await this.saveRollcall(rollcall);
  };

  public getParticipants = (rollcall: IRollcall) => rollcall.participants

  public getNotParticipants = (rollcall: IRollcall) => rollcall.notParticipants

  public get = async () => {
    await this.init();
    return this.rollcalls;
  }

  private saveRollcall = async (rollcall: IRollcall) => this.repo.saveRollcall(rollcall)

  bindToMessage(rollcall: IRollcall, message: Message): Promise<void> {
    return this.saveRollcall({
      ...rollcall,
      message,
    });
  }
}
