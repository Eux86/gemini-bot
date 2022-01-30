import { ITextCommand } from './text-command';
import { ISettingsService } from './settings-service';

export type CommandHandler = (command: ITextCommand, settingsService: ISettingsService) => void;

export interface ICommandDescription {
  commandMatchers: string[];
  isSecret: boolean;
  description: string;
  handler: CommandHandler;
}
