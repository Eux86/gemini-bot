import { Channel, Client, Message, TextChannel } from 'discord.js';
import { ITextCommand } from './types/text-command';
import { ICommandDescription, ICommandsBundle } from './types/command-handler';

export default class Bot {
  commandPrefix = '.';

  private client: Client;

  constructor(private readonly commandBundles: ICommandsBundle[]) {
    const prefix = process.env.BOT_PREFIX;
    if (prefix) {
      this.commandPrefix = prefix;
    }
    console.log('Prefix: ', this.commandPrefix);
    this.client = new Client();
  }

  public async start() {
    await this.client.login(process.env.BOT_TOKEN);
    const commandHandlers = this.loadCommandHandlers();

    this.client.on('message', (msg) => {
      const command = this.interceptTextCommands(msg);
      if (!command) return;

      // Exception for command .help, it will describe all other commands
      this.handleHelpCommand(command);

      // Cycles thorough all the available commands
      this.handleCommand(commandHandlers, command);
    });

    this.client.on('ready', () => {
      this.announceBotInTestChannels();
    });
  }

  private announceBotInTestChannels() {
    this.client.channels.cache.forEach((channel) => {
      if (this.isTextChannel(channel)) {
        if (channel.name === 'bot-tests') {
          channel.send(`Hello! ${this.client.user?.tag} is now available 😎`);
        }
      }
    });
  }

  private handleCommand(
    commandHandlers: ICommandDescription[],
    textCommand: ITextCommand,
  ) {
    console.log(`Received: ${textCommand.name} with ${textCommand.args}`);
    if (
      !commandHandlers.find((commandHandler) =>
        commandHandler.commandMatchers.includes(textCommand.name),
      )
    )
      return;
    try {
      const commandHandler = commandHandlers.find((handler) =>
        handler.commandMatchers.includes(textCommand.name),
      );
      if (commandHandler) {
        commandHandler.handler(textCommand);
      } else {
        textCommand.discordMessage.reply(`No such command: ${textCommand}`);
      }
    } catch (error) {
      console.error(error);
      textCommand.discordMessage.reply('Oops! Cannot execute this command 😟');
    }
  }

  private handleHelpCommand(command: ITextCommand) {
    if (command.name === 'help') {
      const helpText = this.getHelpText();
      command.discordMessage.channel.send(helpText);
    }
  }

  private interceptTextCommands(msg: Message): ITextCommand | undefined {
    if (!msg.content.startsWith(this.commandPrefix)) return undefined;
    const args = msg.content.split(/ +/);
    const name = args?.shift()?.toLowerCase().substring(1);
    if (!name) return undefined;
    return {
      args,
      name,
      discordMessage: msg,
    };
  }

  private loadCommandHandlers(): ICommandDescription[] {
    const clientCommands: ICommandDescription[] = [];

    this.commandBundles.forEach((commandBundle) =>
      Object.values(commandBundle).forEach((commandDescription) =>
        clientCommands.push(commandDescription),
      ),
    );
    return clientCommands;
  }

  broadcastOnAllTextChannels = (message: string) => {
    this.client.channels.cache.forEach((channel) => {
      if (this.isTextChannel(channel)) {
        channel.send(message);
      }
    });
  };

  isTextChannel = (channel: Channel): channel is TextChannel =>
    channel.type === 'text';

  getHelpText = (): string => {
    const cmds = this.commandBundles.reduce<ICommandDescription[]>(
      (acc, curr) => {
        const commandsDescriptions = Object.values(curr);
        return [...acc, ...commandsDescriptions];
      },
      [],
    );
    let helpText = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const command of cmds.filter((cmd) => !cmd.isSecret)) {
      helpText += `\n**${command.commandMatchers}**: *${command.description}*\n`;
    }
    return helpText;
  };
}
