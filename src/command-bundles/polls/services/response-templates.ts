import { IVote } from '../types/poll';

export const generatePollMessage = (description: string, options: string[]) => `
POLL!
${description}

${options.map((op, index) => `${index + 1}: ${op}\n`).join()}

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

export const generatePollResultsMessage = (description: string, options: string[], votes: IVote[]) => `
=== POLL RESULTS ===
${description}

${options.map((option, index) => `
${option}
Votes: ${votes.filter((v) => v.optionIndex - 1 === index).map((x) => x.userName).sort().join(', ')}
`).join('\n')}
`;
