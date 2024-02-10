import { CommandDescription, ICommandsBundle } from './types/command-handler';

export class CommandRegistry {
  constructor(private readonly commandBundles: ICommandsBundle[]) {}

  loadCommandHandlers(): CommandDescription[] {
    const clientCommands: CommandDescription[] = [];

    this.commandBundles.forEach((commandBundle) =>
      Object.values(commandBundle).forEach((commandDescription) =>
        clientCommands.push(commandDescription),
      ),
    );
    return clientCommands;
  }
}
