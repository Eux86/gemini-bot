/* eslint-disable */
import {
  Channel, Client, Message, TextChannel,
} from 'discord.js';
import { commands } from './enabled-commands';
import { ITextCommand } from './types/text-command';
import { ISettingsService } from './types/settings-service';
import { ICommandDescription } from './types/command-handler';
import { SettingsService } from './global-services/settings';

export default class Bot {
  readonly commandPrefix = process.env.BOT_PREFIX || '.';

  private client: Client;

  constructor() {
    this.client = new Client();
  }

  public async start() {
    const settingsService = SettingsService.getInstance();
    await this.client.login(process.env.BOT_TOKEN);
    const commandHandlers = this.loadCommandHandlers();

    this.client.on('message', (msg) => {
      const command = this.interceptTextCommands(msg);
      if (!command) return;

      // Exception for command .help, it will describe all other commands
      this.handleHelpCommand(command);

      // Cycles thorough all the available commands
      this.handleCommand(commandHandlers, command, settingsService);
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

  private handleCommand(commandHandlers: ICommandDescription[], textCommand: ITextCommand, settingsService: ISettingsService) {
    console.log(`Received: ${textCommand.name} with ${textCommand.args}`)
    if (!commandHandlers.find((commandHandler) => commandHandler.commandMatchers.includes(textCommand.name))) return;
    try {
      const commandHandler = commandHandlers.find((handler) => handler.commandMatchers.includes(textCommand.name));
      if (commandHandler) {
        commandHandler.handler(textCommand, settingsService);
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
      const helpText = this.getHelpText(commands);
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

    commands.forEach((commandHandler: ICommandDescription) =>
      commandHandler.commandMatchers.forEach((name: string) =>
        clientCommands.push(commandHandler)));
    return clientCommands;
  }

  broadcastOnAllTextChannels = (message: string) => {
    this.client.channels.cache.forEach((channel) => {
      if (this.isTextChannel(channel)) {
        channel.send(message);
      }
    });
  }

  isTextChannel = (channel: Channel): channel is TextChannel => channel.type === 'text';

  getHelpText = (cmds: Array<ICommandDescription>): string => {
    let helpText = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const command of cmds.filter((cmd) => !cmd.isSecret)) {
      helpText += `\n**${command.commandMatchers}**: *${command.description}*\n`;
    }
    return helpText;
  }
}
