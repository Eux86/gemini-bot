import * as DiscordModule from 'discord.js';
import { Message } from 'discord.js';
import Bot from '../bot';
import { ICommandHandler } from '../types/command-handler';
import { ITextCommand } from '../types/text-command';
import { MockClient } from '../__mocks__/discord-client';

// Mocked command handlers
// This simulates the command bundles that can be added to the bot
const commandHandlersMock: {commands: ICommandHandler[] } = { commands: [] } as any;
jest.mock('../enabled-commands', () => commandHandlersMock);

// Mocked user message from discord
// This simulates a message sent from a discord user
const spyReply = jest.fn();
const spyChannelSend = jest.fn();
const createUserChatMessage: (text: string) => Message = (text) => ({
  content: text,
  reply: spyReply,
  channel: {
    send: spyChannelSend,
  },
} as unknown as Message);

jest.mock('discord.js');
jest.spyOn(DiscordModule, 'Client').mockImplementation(() => new MockClient() as any);

describe('Bot', () => {
  describe('start', () => {
    beforeEach(() => {
      commandHandlersMock.commands.splice(0, commandHandlersMock.commands.length);
    });

    it('should respond when queried with an existing command', async () => {
      const bot = new Bot();
      await bot.start();

      commandHandlersMock.commands.push({
        commandMatchers: ['mock-message'],
        handler: (command: ITextCommand) => command.discordMessage.reply('mock-handler-reply'),
        isSecret: false,
        description: 'fake command handler',
      });

      MockClient.fireUserChatMessageReceived(createUserChatMessage('.mock-message'));
      expect(spyReply).toBeCalledWith('mock-handler-reply');
    });

    it('should not respond when queried with a non existing command', async () => {
      const bot = new Bot();
      await bot.start();

      commandHandlersMock.commands.push({
        commandMatchers: ['mock-message'],
        handler: (command: ITextCommand) => command.discordMessage.reply('mock-handler-reply'),
        isSecret: false,
        description: 'fake command handler',
      });

      MockClient.fireUserChatMessageReceived(createUserChatMessage('not a command'));
      expect(spyReply).not.toBeCalled();
    });

    it('should respond showing the description of the command handlers when queried help command', async () => {
      const bot = new Bot();
      await bot.start();
      commandHandlersMock.commands.push({
        commandMatchers: ['mock'],
        description: 'mock-description',
        handler: jest.fn(),
        isSecret: false,
      });

      MockClient.fireUserChatMessageReceived(createUserChatMessage('.help'));
      expect(spyChannelSend).toBeCalledWith('mock: mock-description\n');
    });

    it('should not show any help when the help command is called but the handler is secret', async () => {
      const bot = new Bot();
      await bot.start();
      commandHandlersMock.commands.push({
        commandMatchers: ['mock'],
        description: 'mock-description',
        handler: jest.fn(),
        isSecret: true,
      });

      MockClient.fireUserChatMessageReceived(createUserChatMessage('.help'));
      expect(spyChannelSend).toBeCalledWith('');
    });
  });
});
