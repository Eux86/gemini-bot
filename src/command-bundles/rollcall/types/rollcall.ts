export interface IRollcall {
  participants: string[];

  notParticipants: string[];

  messageId: string | undefined;

  date: Date;

  channelName: string | undefined;
}
