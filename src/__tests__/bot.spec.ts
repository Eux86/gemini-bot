import * as DiscordModule from 'discord.js';
import { Message } from 'discord.js';
import Bot from '../bot';
import { ICommandHandler } from '../types/command-handler';
import { ITextCommand } from '../types/text-command';
import { MockClient } from '../__mocks__/discord-client';

// Mocked command handlers
// This simulates the command bundles that can be added to the bot
jest.mock('../enabled-commands', (): ICommandHandler[] => ([
  {
    commandMatchers: ['mock-message'],
    handler: (command: ITextCommand) => command.discordMessage.reply('mock-handler-reply'),
    isSecret: false,
    description: 'fake command handler',
  },
]));

// Mocked user message from discord
// This simulates a message sent from a discord user
const spyReply = jest.fn();
const createUserChatMessage: (text: string) => Message = (text) => ({
  content: text,
  reply: spyReply,
} as unknown as Message);

jest.mock('discord.js');
jest.spyOn(DiscordModule, 'Client').mockImplementation(() => new MockClient() as any);

describe('Bot', () => {
  describe('start', () => {
    it('should respond when queried with an existing command', async () => {
      const bot = new Bot();
      await bot.start();

      MockClient.fireUserChatMessageReceived(createUserChatMessage('.mock-message'));
      expect(spyReply).toBeCalledWith('mock-handler-reply');
    });

    it('should not respond when queried with a non existing command', async () => {
      const bot = new Bot();
      await bot.start();

      MockClient.fireUserChatMessageReceived(createUserChatMessage('not a command'));
      expect(spyReply).not.toBeCalled();
    });
  });
});
