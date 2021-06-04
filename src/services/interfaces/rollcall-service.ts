import { Rollcall } from '../rollcall-service/rollcall';
import { Message } from 'discord.js';

export interface IRollcallService {
  generateMessageContent: (rollcall: Rollcall) => string;
  create: (channelName: string) => Promise<Rollcall>;
  addParticipant: (rollcall: Rollcall, name: string) => Promise<void>;
  removeParticipant: (rollcall: Rollcall, name: string) => Promise<void>;
  bindToMessage: (rollcall: Rollcall, message: Message) => Promise<void>;
}
