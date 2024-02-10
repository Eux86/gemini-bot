import { IRollcall } from './rollcall';

export interface IRollcallService {
  create: (channelName: string) => IRollcall;
  addParticipant: (rollcall: IRollcall, name: string) => Promise<void>;
  removeParticipant: (rollcall: IRollcall, name: string) => Promise<void>;
  bindToMessage: (rollcall: IRollcall, messageId: string) => Promise<void>;
  startToday: (channelName: string) => Promise<IRollcall>;
  getToday: (channelName: string) => Promise<IRollcall | undefined>;
  getParticipants: (rollcall: IRollcall) => readonly string[];
  getNotParticipants: (rollcall: IRollcall) => readonly string[];
  get: () => Promise<IRollcall[]>;
}
