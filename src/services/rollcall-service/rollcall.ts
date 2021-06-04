import { Message } from 'discord.js';

export class Rollcall {
  private participants: string[] = [];

  private notParticipants: string[] = [];

  private message: Message | undefined;

  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly channelName: string,
    public readonly date: Date = new Date(),
    // eslint-disable-next-line no-empty-function
  ) {
  }

  public generateMessageContent = () => `
Rollcall started. 
Join using .here.
Remove your presence using .not-here.

${this.participants.length} present${this.participants.length > 1 ? 's' : ''}: ${this.participants.join(', ')}
${this.notParticipants.length} NOT present${this.participants.length > 1 ? 's' : ''}: ${this.notParticipants.join(', ')}
`;

  getMessage(): Message | undefined {
    return this.message;
  }

  setMessage(message: Message) {
    this.message = message;
  }

  public addParticipant = (name: string) => {
    this.notParticipants = this.notParticipants.filter((participant) => participant !== name);
    if (this.participants.find((registered) => registered === name)) {
      throw new Error('ALREADY_REGISTERED');
    }
    this.participants.push(name);
  };

  public removeParticipant = (name: string) => {
    this.participants = this.participants.filter((participant) => participant !== name);
    if (this.notParticipants.find((registered) => registered === name)) {
      throw new Error('ALREADY_NOT_REGISTERED');
    }
    this.notParticipants.push(name);
  };

  public getParticipants = () => this.participants;

  public getNotParticipants = () => this.notParticipants;
}
