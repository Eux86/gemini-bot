import {
  IChannel,
  IMessage,
  ReplyPayload,
} from '../command-service/command-service.interface';

export type CommandHandler = (command: Command) => Promise<void>;

export interface Command {
  args: any;
  channel: IChannel;
  username: string;
  reply: (replyPayload: ReplyPayload) => Promise<IMessage>;
}

export interface PrefixCommandDescription {
  type: 'prefix';
  name: string;
  isSecret: boolean;
  description: string;
  handler: CommandHandler;
}
export interface SlashCommandDescription {
  type: 'slash';
  name: string;
  description: string;
  handler: CommandHandler;
}
export interface ButtonCommandDescription {
  type: 'button';
  name: string;
  handler: CommandHandler;
}

export type CommandDescription =
  | PrefixCommandDescription
  | SlashCommandDescription
  | ButtonCommandDescription;

export interface ICommandsBundle {
  [key: string]: CommandDescription;
}
