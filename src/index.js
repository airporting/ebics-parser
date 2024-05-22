import { accountParser } from './account/index.js';

export default function (text) {
  let allLines = text.split(/\r?\n/);

  if (allLines?.length === 1) {
    allLines = text
      .replaceAll(/ (01|04|05|07)([0-9]{5})( |0)/g, ' \n$1$2$3')
      .split(/\r?\n/);
  }

  const reduced = allLines.reduce(
    (accumulator, currentLine) => {
      if (currentLine.startsWith('01')) {
        accumulator.currentIdx += 1;
        accumulator.chunks.push([currentLine]);
      } else {
        accumulator.chunks[accumulator.currentIdx].push(currentLine);
      }

      return accumulator;
    },
    {
      currentIdx: -1,
      chunks: [],
    }
  );
  const chunksByBank = reduced.chunks;

  try {
    return chunksByBank.map((chunk) => accountParser(chunk));
  } catch (err) {
    if (!chunksByBank) {
      throw 'Header, or footer, missing or malformed';
    } else {
      throw err;
    }
  }
}
