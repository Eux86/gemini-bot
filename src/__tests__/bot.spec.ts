import { CacheType, Interaction } from 'discord.js';
import Bot from '../bot';
import { ITextCommand } from '../types/text-command';
import { ICommandsBundle } from '../types/command-handler';
import { MockClient } from '../__mocks__/discord-client';

// Mocked user message from discord
// This simulates a message sent from a discord user
const spyReply = jest.fn();
const spyChannelSend = jest.fn();
const createUserChatMessage: (text: string) => Interaction<CacheType> = (
  text,
) =>
  ({
    message: {
      content: text,
      reply: spyReply,
      // channel: {
      //   send: spyChannelSend,
      // },
    },
  } as unknown as Interaction<CacheType>);

// jest.mock('discord.js')
// jest
//   .spyOn(DiscordModule, 'Client')
//   .mockImplementation(() => new MockClient() as any);

jest.mock('discord.js', () => {
  const moduleMock = jest.requireActual('discord.js');
  // eslint-disable-next-line global-require
  const mockClient = require('../__mocks__/discord-client').MockClient;
  return {
    ...moduleMock,
    Client: mockClient,
  };
});

// eslint-disable-next-line no-console
console.log = () => undefined;

xdescribe('Bot', () => {
  describe('start', () => {
    let bundles: ICommandsBundle[] | undefined;

    beforeEach(() => {
      bundles = undefined;
    });

    it('should respond when queried with an existing command', async () => {
      bundles = [
        {
          mockCommand: {
            type: 'prefix',
            commandMatchers: ['mock-message'],
            handler: async (command: ITextCommand) => {
              await command.discordMessage.reply('mock-handler-reply');
            },
            isSecret: false,
            description: 'fake command handler',
          },
        },
      ];

      const bot = new Bot(bundles!);
      await bot.start();

      MockClient.fireUserChatMessageReceived(
        createUserChatMessage('.mock-message'),
      );
      expect(spyReply).toBeCalledWith('mock-handler-reply');
    });

    it('should not respond when queried with a non existing command', async () => {
      bundles = [
        {
          mockCommand: {
            type: 'prefix',
            commandMatchers: ['mock-message'],
            handler: async (command: ITextCommand) => {
              await command.discordMessage.reply('mock-handler-reply');
            },
            isSecret: false,
            description: 'fake command handler',
          },
        },
      ];

      const bot = new Bot(bundles);
      await bot.start();

      MockClient.fireUserChatMessageReceived(
        createUserChatMessage('not a command'),
      );
      expect(spyReply).not.toBeCalled();
    });

    it('should respond showing the description of the command handlers when queried help command', async () => {
      bundles = [
        {
          mockCommand: {
            type: 'prefix',
            commandMatchers: ['mock'],
            description: 'mock-description',
            handler: jest.fn(),
            isSecret: false,
          },
        },
      ];

      const bot = new Bot(bundles);
      await bot.start();

      MockClient.fireUserChatMessageReceived(createUserChatMessage('.help'));
      expect(spyChannelSend).toBeCalledWith('\n**mock**: *mock-description*\n');
    });

    it('should not show any help when the help command is called but the handler is secret', async () => {
      bundles = [
        {
          mockCommand: {
            type: 'prefix',
            commandMatchers: ['mock'],
            description: 'mock-description',
            handler: jest.fn(),
            isSecret: true,
          },
        },
      ];

      const bot = new Bot(bundles);
      await bot.start();

      MockClient.fireUserChatMessageReceived(createUserChatMessage('.help'));
      expect(spyChannelSend).toBeCalledWith('');
    });
  });
});
