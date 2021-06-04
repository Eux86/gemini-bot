import { Rollcall } from './rollcall';
import { getService, Services } from '../../service-factory';
import { IRollcallService } from '../interfaces/rollcall-service';
import { Message } from 'discord.js';

export class RollcallService implements IRollcallService {
  public generateMessageContent = (rollcall: Rollcall) => `
Rollcall started. 
Join using .here-test.
Remove your presence using .not-here.

${rollcall.participants.length} present${rollcall.participants.length > 1 ? 's' : ''}: ${rollcall.participants.join(', ')}
${rollcall.notParticipants.length} NOT present${rollcall.participants.length > 1 ? 's' : ''}: ${rollcall.notParticipants.join(', ')}
`;

  public create = async (channelName: string) => {
    const newRollcall = {
      participants: [],
      notParticipants: [],
      channelName,
      message: undefined,
      date: new Date(),
    };
    await this.saveRollcall(newRollcall);
    return newRollcall;
  }

  public addParticipant = (rollcall: Rollcall, name: string) => {
    if (rollcall.participants.find((registered) => registered === name)) {
      throw new Error('ALREADY_REGISTERED');
    }
    return this.saveRollcall({
      ...rollcall,
      notParticipants: rollcall.notParticipants.filter((participant) => participant !== name),
      participants: [...rollcall.participants, name],
    });
  };

  public removeParticipant = (rollcall: Rollcall, name: string) => {
    if (rollcall.notParticipants.find((registered) => registered === name)) {
      throw new Error('ALREADY_NOT_REGISTERED');
    }
    return this.saveRollcall({
      ...rollcall,
      participants: rollcall.participants.filter((participant) => participant !== name),
      notParticipants: [...rollcall.notParticipants, name],
    });
  };

  private saveRollcall = async (rollcall: Rollcall) => getService(Services.Db).saveRollcall(rollcall)

  bindToMessage(rollcall: Rollcall, message: Message): Promise<void> {
    return this.saveRollcall({
      ...rollcall,
      message,
    });
  }
}
