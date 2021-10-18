import { Message } from 'discord.js';
import { IRollcall } from './rollcall';

export interface IRollcallService {
  generateMessageContent: (rollcall: IRollcall) => string;
  create: (channelName: string) => IRollcall;
  addParticipant: (rollcall: IRollcall, name: string) => Promise<void>;
  removeParticipant: (rollcall: IRollcall, name: string) => Promise<void>;
  bindToMessage: (rollcall: IRollcall, message: Message) => Promise<void>;
  startToday: (channelName: string) => Promise<IRollcall>;
  getToday: (channelName: string) => Promise<IRollcall | undefined>
  getParticipants: (rollcall: IRollcall) => readonly string[];
  getNotParticipants: (rollcall: IRollcall) => readonly string[];
  get: () => Promise<IRollcall[]>;
}
