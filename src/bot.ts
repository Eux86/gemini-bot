import {
  Client, Collection, Channel, TextChannel,
} from 'discord.js';
import commands, { ICommand } from './commands';
import { getService, Services } from './service-factory';

class Bot {
  readonly commandPrefix = process.env.BOT_PREFIX || '.';

  private client: Client;

  constructor() {
    console.log(process.env.BOT_PREFIX);
    const settingsService = getService(Services.Settings);

    this.client = new Client();
    const clientCommands = new Collection<string, ICommand>();

    commands.forEach((command: ICommand) => {
      clientCommands.set(`${this.commandPrefix}${command.name}`, command);
    });

    this.client.on('message', (msg: any) => {
      // Clean and reads the command
      const args = msg.content.split(/ +/);
      const command = args.shift().toLowerCase();
      // console.log('command', clientCommands);

      // Exception for command .help, it will describe all other commands
      if (command === `${this.commandPrefix}help`) {
        const helpText = this.getHelpText(commands);
        msg.channel.send(helpText);
        return;
      }
      if (!clientCommands.has(command)) return;

      // Cycles thorugh all the available commands
      try {
        const concreteCommand = clientCommands.get(command);
        if (concreteCommand) {
          concreteCommand.command(msg, args, settingsService);
        } else {
          msg.reply(`No such command: ${command}`);
        }
      } catch (error) {
        console.error(error);
        msg.reply('Oops! Cannot execute this command 😟');
      }
    });

    this.client.on('ready', () => {
      this.client.channels.cache.forEach((channel) => {
        if (this.isTextChannel(channel)) {
          if (channel.name === 'bot-tests') {
            channel.send(`Hello! ${this.client.user?.tag} is now available 😎`);
          }
        }
      });
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });

    this.client.login(process.env.BOT_TOKEN);
  }

  broadcastOnAllChannels = (message: string) => {
    this.client.channels.cache.forEach((channel) => {
      if (this.isTextChannel(channel)) {
        channel.send(message);
      }
    });
  }

  isTextChannel = (channel: Channel): channel is TextChannel => channel.type === 'text';

  // eslint-disable-next-line no-shadow
  getHelpText = (commands: Array<ICommand>): string => {
    let helpText = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const command of commands) {
      helpText += `${command.name}: ${command.description}\n`;
    }
    return helpText;
  }
}

export default Bot;
