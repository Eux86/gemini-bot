// noinspection UnnecessaryLocalVariableJS

const minimalEpitaphSize = 5;
const maxEpitaphSize = 26;

const repeat = (text: string, times: number): string => {
  if (times < 1) return '';
  const repeated = new Array(Math.ceil(times)).fill(text).join('');
  return repeated;
};

const makeEpitaphLine = (line: string, maxLineLength: number): string => {
  const missingSpacesEpitaph = repeat(' ', Math.max(0, Math.max(maxLineLength, 5) - line.length));
  const epitaphLine = `         |  ${line}${missingSpacesEpitaph}  |`;
  return epitaphLine;
};

const tombstoneMaker = (epitaph: string): string => {
  const additionalSpaces = Math.min(Math.max(0, Math.min(epitaph.length, maxEpitaphSize) - minimalEpitaphSize), maxEpitaphSize);
  const additionalSpacesCross = Math.min(Math.max(1, additionalSpaces / 2), maxEpitaphSize);

  const spacesInnerTombstone = repeat(' ', additionalSpaces);
  const spacesCross = repeat(' ', additionalSpacesCross);
  const topTombstone = repeat('~', additionalSpaces);
  const bottomTombstone = repeat('^', additionalSpaces);

  const regexDivideChunks = new RegExp(`.{1,${maxEpitaphSize}}`, 'g');
  const epitaphChunks = epitaph.match(regexDivideChunks) || [epitaph];
  const longestChunkLength = Math.max(...epitaphChunks.map((line) => line.length));
  const epitaphLines = epitaphChunks.map((line) => makeEpitaphLine(line, longestChunkLength)).join('\n');

  return `
  ${spacesCross}           .
  ${spacesCross}          -|-
  ${spacesCross}           |
           .-'~${topTombstone}'-.
         .'${spacesInnerTombstone}       '.
${epitaphLines}
         | ${spacesInnerTombstone}        |
         | ${spacesInnerTombstone}        |
       ^^^^^^^^^^^^^^^${bottomTombstone}
  `.trim();
};

export { tombstoneMaker };
