import { CacheType, Interaction } from 'discord.js';
import { ITextCommand } from './text-command';

export type CommandHandler = (command: ITextCommand) => Promise<void>;
export type InteractionHandler = (
  command: Interaction<CacheType>,
) => Promise<void>;

export interface ICommandDescription {
  commandMatchers: string[];
  isSecret: boolean;
  description: string;
  handler?: CommandHandler;
  interactionHandler?: InteractionHandler;
}

export interface ICommandsBundle {
  [key: string]: ICommandDescription;
}
