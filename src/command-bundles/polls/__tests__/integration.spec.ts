import { Message } from 'discord.js';
import { poll } from '../handlers/poll';
import { ISettingsService } from '../../../types/settings-service';
import { pollAdd } from '../handlers/add-option';
import { pollVote } from '../handlers/vote';
import { IVote } from '../types/poll';
import { pollClose } from '../handlers/poll-close';

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

const expectedPollResult = (description: string, options: string[], votes: IVote[]) => `
=== POLL RESULTS ===
${description}

${options.map((option, index) => `
${option}
Votes: ${votes.filter((v) => v.optionIndex - 1 === index).map((x) => x.userName).sort().join(', ')}
`).join('\n')}
`;

const spySend = jest.fn();
const spyDelete = jest.fn();

type DeepPartial<T> = T extends object ? {
  [key in keyof T]?: DeepPartial<T[key]>
}: T;

const mockedDiscordMessage: DeepPartial<Message> = {
  channel: {
    send: spySend,
    id: 'mock-channel',
  },
  author: {
    username: 'mock-message-user',
  },
  delete: spyDelete,
};

describe('polls command tests', () => {
  const pollDescription = 'my mock poll';
  const option1 = 'option number 1';
  const option2 = 'option number 2';
  const votes: IVote[] = [
    {
      userName: 'mock user 1',
      optionIndex: 1,
    },
    {
      userName: 'mock user 2',
      optionIndex: 2,
    },
    {
      userName: 'mock user 1',
      optionIndex: 2,
    },
  ];

  const callPollVote = async (vote: IVote) => {
    const mockedMessageCustomAuthor = {
      ...mockedDiscordMessage,
      author: {
        username: vote.userName,
      },
    };
    await pollVote.handler({ name: 'poll-vote', args: [vote.optionIndex.toString()], discordMessage: mockedMessageCustomAuthor as Message }, {} as ISettingsService);
  };

  it('should create a new poll when receives the command "create" with a single argument for the description', async () => {
    await poll.handler({ name: 'poll', args: [pollDescription], discordMessage: mockedDiscordMessage as Message }, {} as ISettingsService);
    expect(spySend).toHaveBeenCalledWith(expectedPollOutput(pollDescription, []));
  });

  it('should add an option to a poll when the command "add" is used with a description', async () => {
    await pollAdd.handler({ name: 'poll-add', args: option1.split(' '), discordMessage: mockedDiscordMessage as Message }, {} as ISettingsService);
    expect(spySend).toHaveBeenCalledWith(expectedPollOutput(pollDescription, [option1]));
  });

  it('should add a second option to a poll when the command "add" is used after another', async () => {
    await pollAdd.handler({ name: 'poll-add', args: option2.split(' '), discordMessage: mockedDiscordMessage as Message }, {} as ISettingsService);
    expect(spySend).toHaveBeenCalledWith(expectedPollOutput(pollDescription, [option1, option2]));
  });

  it('should give feedback to the user when the "poll-vote" command is called', async () => {
    await callPollVote(votes[0]);
    expect(spySend).toHaveBeenCalledWith(`Vote received ${votes[0].userName}!`);
  });

  it('should show the poll results when the "poll-terminate" command is called', async () => {
    await callPollVote(votes[1]);
    await callPollVote(votes[2]);
    await pollClose.handler({ name: 'poll-close', args: [], discordMessage: mockedDiscordMessage as Message }, {} as ISettingsService);
    expect(spySend).toHaveBeenCalledWith(expectedPollResult(pollDescription, [option1, option2], votes));
  });
});
