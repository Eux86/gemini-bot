export const generatePollMessage = (description: string, options: string[]) => `
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
