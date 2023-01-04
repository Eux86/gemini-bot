import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';
import { ITextCommand } from './text-command';

export type PrefixCommandHandler = (command: ITextCommand) => Promise<void>;
export type SlashCommandHandler = (
  command: ChatInputCommandInteraction,
) => Promise<void>;
export type ButtonCommandHandler = (
  command: ButtonInteraction,
) => Promise<void>;

export interface PrefixCommandDescription {
  type: 'prefix';
  commandMatchers: string[];
  isSecret: boolean;
  description: string;
  handler: PrefixCommandHandler;
}
export interface SlashCommandDescription {
  type: 'slash';
  name: string;
  description: string;
  handler: SlashCommandHandler;
}
export interface ButtonCommandDescription {
  type: 'button';
  name: string;
  handler: ButtonCommandHandler;
}

export type CommandDescription =
  | PrefixCommandDescription
  | SlashCommandDescription
  | ButtonCommandDescription;

export interface ICommandsBundle {
  [key: string]: CommandDescription;
}
