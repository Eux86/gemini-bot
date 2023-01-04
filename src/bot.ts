import {
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  Client,
  Events,
  GatewayIntentBits,
  Message,
  REST,
  Routes,
  TextChannel,
} from 'discord.js';
import { ITextCommand } from './types/text-command';
import {
  ButtonCommandDescription,
  CommandDescription,
  ICommandsBundle,
  PrefixCommandDescription,
  SlashCommandDescription,
} from './types/command-handler';

export default class Bot {
  commandPrefix = '.';

  private client: Client;

  constructor(private readonly commandBundles: ICommandsBundle[]) {
    const prefix = process.env.BOT_PREFIX;
    if (prefix) {
      this.commandPrefix = prefix;
    }
    console.log('Prefix: ', this.commandPrefix);
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
      ],
    });
  }

  public async start() {
    await this.client.login(process.env.BOT_TOKEN);
    const commandHandlers = this.loadCommandHandlers();
    const prefixCommandHandlers = commandHandlers.filter(
      (command): command is PrefixCommandDescription =>
        command.type === 'prefix',
    );
    const slashCommandHandlers = commandHandlers.filter(
      (command): command is SlashCommandDescription => command.type === 'slash',
    );
    const buttonCommandHandlers = commandHandlers.filter(
      (command): command is ButtonCommandDescription =>
        command.type === 'button',
    );

    this.client.on('messageCreate', (msg) => {
      console.log(msg.content);
      const command = this.interceptTextCommands(msg);
      if (!command) return;

      // Exception for command .help, it will describe all other commands
      this.handleHelpCommand(command);

      this.handlePrefixCommand(prefixCommandHandlers, command);

      this.handleInit(slashCommandHandlers, command);
    });

    this.client.on('ready', () => {
      this.announceBotInTestChannels();
    });

    this.client.on(Events.InteractionCreate, (interaction) => {
      if (interaction.isChatInputCommand()) {
        this.handleSlashCommand(slashCommandHandlers, interaction);
      }
      if (interaction.isButton()) {
        this.handleButtonCommand(buttonCommandHandlers, interaction);
      }
    });
  }

  private announceBotInTestChannels() {
    this.client.channels.cache.forEach((channel) => {
      if (channel instanceof TextChannel) {
        if (channel.name === 'bot-tests') {
          channel.send(`Hello! ${this.client.user?.tag} is now available 😎`);
        }
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private handlePrefixCommand(
    commandHandlers: PrefixCommandDescription[],
    textCommand: ITextCommand,
  ) {
    console.log(`Received: ${textCommand.name} with ${textCommand.args}`);
    const currentHandler = commandHandlers.find((commandHandler) =>
      commandHandler.commandMatchers.includes(textCommand.name),
    );
    if (!currentHandler) {
      return;
    }
    try {
      currentHandler.handler?.(textCommand);
    } catch (error) {
      console.error(error);
      textCommand.discordMessage.reply(
        'Oops! Cannot execute this command: something went wrong 😟',
      );
    }
  }

  private handleSlashCommand(
    commandHandlers: SlashCommandDescription[],
    interaction: ChatInputCommandInteraction<CacheType>,
  ) {
    console.log(`Received interaction: ${interaction}`);
    const currentHandler = commandHandlers.find(
      (commandHandler) => commandHandler.name === interaction.commandName,
    );
    if (!currentHandler) {
      return;
    }
    try {
      currentHandler.handler?.(interaction);
    } catch (error) {
      console.error(error);
      interaction.reply(
        'Oops! Cannot execute this command: something went wrong 😟',
      );
    }
  }

  private handleButtonCommand(
    commandHandlers: ButtonCommandDescription[],
    interaction: ButtonInteraction<CacheType>,
  ) {
    console.log(
      `Received button interaction: ${JSON.stringify(interaction.customId)}`,
    );
    const currentHandler = commandHandlers.find(
      (commandHandler) => commandHandler.name === interaction.customId,
    );
    if (!currentHandler) {
      return;
    }
    try {
      currentHandler.handler(interaction);
    } catch (error) {
      console.error(error);
      interaction.reply(
        'Oops! Cannot execute this command: something went wrong 😟',
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async handleInit(
    commandHandlers: SlashCommandDescription[],
    textCommand: ITextCommand,
  ) {
    if (textCommand.name !== 'register') return;

    if (!process.env.BOT_TOKEN) {
      throw new Error('Missing BOT_TOKEN in env variables');
    }
    if (!process.env.CLIENT_ID) {
      throw new Error('Missing CLIENT_ID in env variables');
    }

    const commandsList = commandHandlers.map((command) => ({
      name: command.name,
      description: command.description,
      options: [],
      name_localizations: undefined,
      description_localizations: undefined,
      default_permission: undefined,
      default_member_permissions: undefined,
      dm_permission: undefined,
    }));

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    try {
      const data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commandsList },
      );
      textCommand.discordMessage.channel.send(
        `Successfully reloaded ${
          (data as any)?.length
        } application (/) commands.`,
      );
    } catch (error) {
      textCommand.discordMessage.channel.send(
        `Error reloading commands ${JSON.stringify(error)}`,
      );
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

  private loadCommandHandlers(): CommandDescription[] {
    const clientCommands: CommandDescription[] = [];

    this.commandBundles.forEach((commandBundle) =>
      Object.values(commandBundle).forEach((commandDescription) =>
        clientCommands.push(commandDescription),
      ),
    );
    return clientCommands;
  }

  getHelpText = (): string => {
    const cmds = this.loadCommandHandlers().filter(
      (command): command is PrefixCommandDescription =>
        command.type === 'prefix',
    );
    let helpText = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const command of cmds.filter((cmd) => !cmd.isSecret)) {
      helpText += `\n**${command.commandMatchers}**: *${command.description}*\n`;
    }
    return helpText;
  };
}
