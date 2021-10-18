import { ITextCommand } from './text-command';
import { ISettingsService } from './settings-service';

export interface ICommandHandler {
  commandMatchers: string[];
  isSecret: boolean;
  description: string;
  handler: (command: ITextCommand, settingsService: ISettingsService) => void;
}
