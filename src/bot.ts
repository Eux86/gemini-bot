import { CommandDescription, ICommandsBundle } from './types/command-handler';
import { CommandRegistry } from './command-registry';
import { ICommandService } from './command-service/command-service.interface';
import { DiscordCommandService } from './command-service/discordjs-command-service';

export default class Bot {
  private commandService: ICommandService;

  private readonly commands: CommandDescription[];

  constructor(private readonly commandBundles: ICommandsBundle[]) {
    this.commandService = new DiscordCommandService();

    const commandRegistry = new CommandRegistry(this.commandBundles);
    this.commands = commandRegistry.loadCommandHandlers();
  }

  public async start() {
    return this.commandService.start(this.commands);
  }
}
