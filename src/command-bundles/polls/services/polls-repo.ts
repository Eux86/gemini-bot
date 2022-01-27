import { IPollsRepo } from '../types/polls-repo';
import { IPoll } from '../types/poll';

export class PollsRepo implements IPollsRepo {
  private polls: IPoll[] = [];

  get(): Promise<IPoll[] | undefined> {
    return Promise.resolve(this.polls);
  }

  set(polls: IPoll[]): Promise<void> {
    this.polls = polls;
    return Promise.resolve();
  }
}
