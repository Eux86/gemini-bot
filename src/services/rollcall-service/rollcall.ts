import { Message } from 'discord.js';

export class Rollcall {
  private participants: string[] = [];

  private message: Message | undefined;

  // eslint-disable-next-line no-useless-constructor
  constructor(
    public date: Date = new Date(),
    // eslint-disable-next-line no-empty-function
  ) {
  }

  public generateMessageContent = () => `
Rollcall started. 
Join using .here-test.
Remove your presence using .not-here.

${this.participants.length} present${this.participants.length > 1 ? 's' : ''}: ${this.participants.join(', ')}`;

  getMessage(): Message | undefined {
    return this.message;
  }

  setMessage(message: Message) {
    this.message = message;
  }

  public addParticipant = (name: string) => {
    if (this.participants.find((registered) => registered === name)) {
      throw new Error('ALREADY_REGISTERED');
    }
    this.participants.push(name);
  };

  public removeParticipant = (name: string) => {
    if (!this.participants.find((registered) => registered === name)) {
      throw new Error('NOT_REGISTERED');
    }
    this.participants = this.participants.filter((registered) => registered !== name);
  };
}
