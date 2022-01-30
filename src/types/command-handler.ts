import { ITextCommand } from './text-command';

export type CommandHandler = (command: ITextCommand) => Promise<void>;

export interface ICommandDescription {
  commandMatchers: string[];
  isSecret: boolean;
  description: string;
  handler: CommandHandler;
}

export interface ICommandsBundle {
  [key: string]: ICommandDescription;
}
