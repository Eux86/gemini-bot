import { IPoll } from './poll';

export interface IPollsRepo {
  set: (polls: IPoll[]) => Promise<void>;
  get: () => Promise<IPoll[] | undefined>;
}
