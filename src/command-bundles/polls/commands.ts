import { ICommandDescription } from '../../types/command-handler';
import { pollPullHandler } from './handlers/poll-pull';
import { pollAddHandler } from './handlers/add-option';
import { pollHandler } from './handlers/poll';
import { pollClosHandler } from './handlers/poll-close';
import { pollVoteHandler } from './handlers/vote';
import { pollVoteRemoveHandler } from './handlers/poll-vote-remove';

export const commands: {[key: string]: ICommandDescription} = {
  poll: {
    commandMatchers: ['poll'],
    description: 'Creates a new poll.\nUsage `poll a description for the poll`',
    isSecret: false,
    handler: pollHandler,
  },
  pollAdd: {
    commandMatchers: ['poll-add'],
    description: 'Adds an option to the poll in the channel.\nUsage `poll-add description of an option`',
    isSecret: false,
    handler: pollAddHandler,
  },
  pollClose: {
    commandMatchers: ['poll-close'],
    description: 'Closes the current poll and shows the results.\nUsage `poll-close`',
    isSecret: false,
    handler: pollClosHandler,
  },
  pollVote: {
    commandMatchers: ['poll-vote'],
    description: 'Vote an option of the poll.\nUsage `poll-vote number of the voted option`',
    isSecret: false,
    handler: pollVoteHandler,
  },
  pollVoteRemove: {
    commandMatchers: ['poll-vote-remove'],
    description: 'Remove an already given vote from the poll.\nUsage `poll-vote-remove number of the voted option`',
    isSecret: false,
    handler: pollVoteRemoveHandler,
  },
  pollPull: {
    commandMatchers: ['poll-pull'],
    description: 'Pulls the poll message down.\nUsage `poll-pull`',
    isSecret: false,
    handler: pollPullHandler,
  },
};
