import { IPoll, IVote, PollState } from '../types/poll';

const getNumberOfVotesForOption = (votes: IVote[], optionIndex: number): number => votes.filter((v) => v.optionIndex - 1 === optionIndex).length;

const getVotersForOption = (votes: IVote[], optionIndex: number) => votes.filter((v) => v.optionIndex - 1 === optionIndex).map((x) => x.userName).sort().join(', ');

const generateVoteInfo = (options: string[], votes: IVote[]) => {
  let returnString = '';
  options.forEach((option, index) => {
    const numberOfVotes = getNumberOfVotesForOption(votes, index);
    const listOfVoters = numberOfVotes > 0 ? ` (${getVotersForOption(votes, index)})` : '';

    returnString += (`${index + 1}) ${option}\nVotes: ${numberOfVotes}${listOfVoters}${index < options.length - 1 ? '\n\n' : ''}`);
  });
  return returnString;
};

export const generatePollMessage = ({
  description,
  options,
  votes,
  state,
}: IPoll) => {
  const votersListString = generateVoteInfo(options, votes);
  return (`
### POLL ${state === PollState.Open ? 'OPEN' : 'CLOSED'} ###
${description}

${options.length < 1 ? '*still no options added to the poll*' : votersListString}

Use the \`help\` command to see how to add options to the poll and vote.
`);
};
