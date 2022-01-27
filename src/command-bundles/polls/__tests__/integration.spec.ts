import { Message } from 'discord.js';
import { poll } from '../handlers/poll';
import { ISettingsService } from '../../../types/settings-service';
import { pollAdd } from '../handlers/add-option';

const expectedPollOutput = (description: string, options: string[]) => `
POLL!
${description}

${options.map((op, index) => `${index + 1}: ${op}\n`)}

Add options to the poll with: 
poll add option description

For example: 
poll add I like StrawLegacy
poll add I don't like StrawLegacy

Vote your option with: 
poll vote option-number

For example: 
poll vote 1
poll vote 2
`;

const spySend = jest.fn();

type DeepPartial<T> = T extends object ? {
  [key in keyof T]?: DeepPartial<T[key]>
}: T;

const mockedDiscordMessage: DeepPartial<Message> = {
  channel: {
    send: spySend,
    id: 'mock-channel',
  },
};

describe('polls command tests', () => {
  it('should create a new poll when receives the command "create" with a single argument for the description', async () => {
    const pollDescription = 'my mock poll';
    await poll.handler({ name: 'poll', args: [pollDescription], discordMessage: mockedDiscordMessage as Message }, {} as ISettingsService);
    expect(spySend).toHaveBeenCalledWith(expectedPollOutput(pollDescription, []));
  });

  it('should add an option to a poll when the command "add" is used with a description', async () => {
    const pollDescription = 'my mock poll';
    const option1 = 'option number 1';
    await pollAdd.handler({ name: 'poll-add', args: option1.split(' '), discordMessage: mockedDiscordMessage as Message }, {} as ISettingsService);
    expect(spySend).toHaveBeenCalledWith(expectedPollOutput(pollDescription, [option1]));
  });
});
