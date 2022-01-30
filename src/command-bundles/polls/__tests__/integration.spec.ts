import { Message } from 'discord.js';
import { ISettingsService } from '../../../types/settings-service';
import { IVote } from '../types/poll';
import { mockDiscordMessage } from '../__mocks__/base-discord-message';
import { errorMessages } from '../services/error-messages';
import { pollAddHandler } from '../handlers/add-option';
import { pollHandler } from '../handlers/poll';
import { pollClosHandler } from '../handlers/poll-close';
import { pollVoteHandler } from '../handlers/vote';
import { pollVoteRemoveHandler } from '../handlers/poll-vote-remove';
import * as PollsRepoModule from '../services/polls-repo';
import { PollsRepo } from '../services/polls-repo';

jest.spyOn(PollsRepoModule, 'PollsRepo').mockReturnValue({
  get: () => Promise.resolve([]),
  set: () => Promise.resolve(),
} as unknown as PollsRepo);

describe('Polls bundle integration', () => {
  const spySend = jest.fn().mockReturnValue({ id: 'mock-response-message-id' });
  const spyDelete = jest.fn();
  const mockedDiscordMessage = mockDiscordMessage({
    spySend,
    spyDelete,
  });
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
    } as Message;
    await pollVoteHandler({ name: 'poll-vote', args: [vote.optionIndex.toString()], discordMessage: mockedMessageCustomAuthor }, {} as ISettingsService);
  };

  describe('Creation of a new poll with options and votes', () => {
    it('should create a new poll when receives the command "create" with a single argument for the description', async () => {
      // eslint-disable-next-line operator-linebreak
      const expectedPollOutput =
`
**the poll command is new and could break**

### POLL OPEN ###
${pollDescription}

*still no options added to the poll*

Use the \`help\` command to see how to add options to the poll and vote.
`;
      await pollHandler({
        name: 'poll',
        args: pollDescription.split(' '),
        discordMessage: mockedDiscordMessage,
      }, {} as ISettingsService);
      expect(spySend)
        .toHaveBeenCalledWith(expectedPollOutput);
    });

    it('should add an option to a poll when the command "add" is used with a description', async () => {
      // eslint-disable-next-line operator-linebreak
      const expectedPollOutput =
`
**the poll command is new and could break**

### POLL OPEN ###
${pollDescription}

1) ${option1}
Votes: 0

Use the \`help\` command to see how to add options to the poll and vote.
`;
      await pollAddHandler({
        name: 'poll-add',
        args: option1.split(' '),
        discordMessage: mockedDiscordMessage,
      }, {} as ISettingsService);
      expect(spySend)
        .toHaveBeenCalledWith(expectedPollOutput);
    });

    it('should add a second option to a poll when the command "add" is used after another', async () => {
      // eslint-disable-next-line operator-linebreak
      const expectedPollOutput =
`
**the poll command is new and could break**

### POLL OPEN ###
${pollDescription}

1) ${option1}
Votes: 0

2) ${option2}
Votes: 0

Use the \`help\` command to see how to add options to the poll and vote.
`;
      await pollAddHandler({
        name: 'poll-add',
        args: option2.split(' '),
        discordMessage: mockedDiscordMessage,
      }, {} as ISettingsService);
      expect(spySend)
        .toHaveBeenCalledWith(expectedPollOutput);
    });

    it('should give feedback to the user when the "poll-vote" command is called', async () => {
      // eslint-disable-next-line operator-linebreak
      const expectedPollOutput =
`
**the poll command is new and could break**

### POLL OPEN ###
${pollDescription}

1) ${option1}
Votes: 1 (${votes[0].userName})

2) ${option2}
Votes: 0

Use the \`help\` command to see how to add options to the poll and vote.
`;
      await callPollVote(votes[0]);
      expect(spySend)
        .toHaveBeenCalledWith(expectedPollOutput);
    });

    it('should show the poll results when the "poll-terminate" command is called', async () => {
      // eslint-disable-next-line operator-linebreak
      const expectedPollOutput =
`
**the poll command is new and could break**

### POLL OPEN ###
${pollDescription}

1) ${option1}
Votes: 1 (${votes[0].userName})

2) ${option2}
Votes: 2 (${votes[2].userName}, ${votes[1].userName})

Use the \`help\` command to see how to add options to the poll and vote.
`;
      await callPollVote(votes[1]);
      await callPollVote(votes[2]);
      await pollClosHandler({
        name: 'poll-close',
        args: [],
        discordMessage: mockedDiscordMessage,
      }, {} as ISettingsService);
      expect(spySend)
        .toHaveBeenCalledWith(expectedPollOutput);
    });
  });

  describe('Error cases', () => {
    it('should return an error when a new poll is requested without a description', async () => {
      await pollHandler({ name: 'poll', args: [], discordMessage: mockDiscordMessage({ spySend }) }, {} as ISettingsService);
      expect(spySend).toHaveBeenCalledWith(`Error: ${errorMessages.POLL_CREATION_NO_DESCRIPTION_PROVIDED}`);
    });

    it('should not allow adding a vote when the vote already exist for that user', async () => {
      await pollHandler({ name: 'poll', args: 'this is a test poll'.split(' '), discordMessage: mockDiscordMessage({ spySend }) }, {} as ISettingsService);
      await pollAddHandler({ name: 'pollAdd', args: 'first option of my poll'.split(' '), discordMessage: mockDiscordMessage({ spySend }) }, {} as ISettingsService);
      await pollVoteHandler({ name: 'pollVote', args: ['0'], discordMessage: mockDiscordMessage({ spySend }) }, {} as ISettingsService);
      await pollVoteHandler({ name: 'pollVote', args: ['0'], discordMessage: mockDiscordMessage({ spySend }) }, {} as ISettingsService);
      expect(spySend).toHaveBeenCalledWith(`Error: ${errorMessages.POLL_VOTE_ALREADY_EXISTS}`);
      await pollClosHandler({ name: 'pollClose', args: [], discordMessage: mockDiscordMessage({ spySend }) }, {} as ISettingsService);
    });

    it('should not allow removing a vote when the vote does not exist for that user', async () => {
      await pollHandler({ name: 'poll', args: 'this is a test poll'.split(' '), discordMessage: mockDiscordMessage({ spySend }) }, {} as ISettingsService);
      await pollAddHandler({ name: 'pollAdd', args: 'first option of my poll'.split(' '), discordMessage: mockDiscordMessage({ spySend }) }, {} as ISettingsService);
      await pollVoteRemoveHandler({ name: 'pollVote', args: ['0'], discordMessage: mockDiscordMessage({ spySend }) }, {} as ISettingsService);
      expect(spySend).toHaveBeenCalledWith(`Error: ${errorMessages.POLL_VOTE_DOES_NOT_EXIST}`);
      await pollClosHandler({ name: 'pollClose', args: [], discordMessage: mockDiscordMessage({ spySend }) }, {} as ISettingsService);
    });
  });
});
