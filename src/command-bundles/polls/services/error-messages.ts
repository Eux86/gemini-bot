import { PollErrors } from '../types/errors';

type ErrorMessageMapper = {[key in PollErrors]?: string}
export const errorMessages: ErrorMessageMapper = {
  [PollErrors.POLL_CREATION_NO_DESCRIPTION_PROVIDED]: 'There is no description for the poll. Use the `help` command for more info.',
  [PollErrors.POLL_ADD_OPTION_NO_DESCRIPTION_PROVIDED]: 'There is no description for the option you are adding. Use the `help` command for more info.',
  [PollErrors.POLL_ALREADY_EXIST_IN_CHANNEL]: 'There is already a running poll in this channel. Use the `help` command to check how to pull down the poll message',
  [PollErrors.POLL_DOES_NOT_EXIST_IN_CHANNEL]: 'No poll in this channel. Use the `help` command for more info on how to create a poll',
  [PollErrors.POLL_VOTE_ALREADY_EXISTS]: 'You already voted for this option',
  [PollErrors.POLL_VOTE_DOES_NOT_EXIST]: 'You never voted for this option',
};
