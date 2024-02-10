import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  Events,
  GatewayIntentBits,
  Message,
  REST,
  Routes,
} from 'discord.js';
import {
  ICommandService,
  IMessage,
  Interaction,
  InteractionStyle,
  ReplyPayload,
} from './command-service.interface';
import {
  CommandDescription,
  SlashCommandDescription,
} from '../types/command-handler';
import { DiscordJsMessage } from './discordjs-message';
import { DiscordJsChannel } from './discordjs-channel';

function assertUnreachable(x: never): Error {
  return new Error("Didn't expect to get here: " + x);
}

export class DiscordCommandService implements ICommandService {
  private client: Client;

  private botToken: string;

  constructor() {
    this.botToken = process.env.BOT_TOKEN || '';

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
      ],
    });
  }

  public async start(commands: CommandDescription[]) {
    await this.client.login(this.botToken);
    await this.registerSlashCommands(commands);
    return this.registerCommands(commands);
  }

  private registerCommands(commands: CommandDescription[]) {
    return new Promise<void>((resolve, reject) => {
      this.client.on(Events.InteractionCreate, async (interaction) => {
        try {
          const channel = interaction.channel;
          if (!channel) return;
          if (interaction.isChatInputCommand() || interaction.isButton()) {
            await interaction.deferReply();
            const receivedCommandName = interaction.isChatInputCommand()
              ? interaction.commandName
              : interaction.customId;
            const supportedCommands = commands.find(
              (supportedCommand) =>
                supportedCommand.name === receivedCommandName,
            );
            if (supportedCommands) {
              const replyFunction =
                this.getReplyFunctionForDiscord(interaction);
              return await supportedCommands.handler({
                args: [],
                channel: new DiscordJsChannel(channel),
                username: interaction.user.username,
                reply: replyFunction,
              });
            } else {
              console.log('Unsupported command', receivedCommandName);
              return;
            }
          } else {
            console.log('Unsupported command type', interaction.type);
            return;
          }
        } catch (error) {
          console.error('Failed to handle interaction', error);
          reject(error);
        }
      });
      resolve();
    });
  }

  /**
   * Creates a function that can be used to reply to a discord interaction outside of the
   * discord context, so that the reply can be handled generically without the rest
   * of the system needing to know about discord.
   *
   * @param discordInteraction
   * @private
   */
  private getReplyFunctionForDiscord(
    discordInteraction: ChatInputCommandInteraction | ButtonInteraction,
  ): (payload: ReplyPayload) => Promise<IMessage> {
    return async ({
      content,
      interactions,
    }: ReplyPayload): Promise<DiscordJsMessage> => {
      const buttons = interactions?.map((interaction) => {
        return this.toButton(interaction);
      });
      return this.replyToInteraction(discordInteraction, buttons, content);
    };
  }

  /**
   * Handles how to reply to a discord interaction.
   *
   * @param discordInteraction The discord interaction to reply to
   * @param buttons The buttons to include in the reply
   * @param content The text content of the reply
   * @private
   */
  private async replyToInteraction(
    discordInteraction: ChatInputCommandInteraction | ButtonInteraction,
    buttons: ButtonBuilder[] | undefined,
    content: string,
  ) {
    let message: Message;
    try {
      if (buttons) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          ...buttons,
        );
        message = await discordInteraction.editReply({
          content,
          components: [row],
        });
      } else {
        message = await discordInteraction.editReply({
          content,
        });
      }
    } catch (error) {
      console.error('Failed to reply', error);
      throw new Error('Failed to reply');
    }
    return Promise.resolve(new DiscordJsMessage(message));
  }

  private toButton(interaction: Interaction) {
    let style = ButtonStyle.Primary;
    switch (interaction.style) {
      case InteractionStyle.Primary:
        style = ButtonStyle.Primary;
        break;
      case InteractionStyle.Secondary:
        style = ButtonStyle.Secondary;
        break;
      default:
        throw assertUnreachable(interaction.style);
    }
    return new ButtonBuilder()
      .setCustomId(interaction.id)
      .setLabel(interaction.label)
      .setStyle(style);
  }

  private async registerSlashCommands(commands: CommandDescription[]) {
    if (!process.env.BOT_TOKEN) {
      throw new Error('Missing BOT_TOKEN in env variables');
    }
    if (!process.env.CLIENT_ID) {
      throw new Error('Missing CLIENT_ID in env variables');
    }

    const commandsList = commands
      .filter(
        (command): command is SlashCommandDescription =>
          command.type === 'slash',
      )
      .map((command) => ({
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
      console.log(
        `Successfully reloaded ${
          (data as any)?.length
        } application (/) commands. (${(data as any)
          .map((x: any) => x.name)
          .join(', ')})`,
      );
    } catch (error) {
      console.error(`Error reloading commands ${JSON.stringify(error)}`);
    }
  }
}
