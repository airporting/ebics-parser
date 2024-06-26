import { accountParser } from '@/src/account';

export default function (text: string) {
  let allLines = text.split(/\r?\n/).filter((line) => line !== '');

  if (allLines?.length === 1) {
    allLines = text
      .replaceAll(/ (01|04|05|07)([0-9]{5})( |0)/g, ' \n$1$2$3')
      .split(/\r?\n/)
      .filter((line) => line !== '');
  }
  // console.log(allLines);
  if (allLines.every((line) => line.startsWith('01'))) {
    allLines = allLines
      .map((line) => {
        return line
          .replaceAll(/ (01|04|05|07)([0-9]{5})( |0)/g, ' \n$1$2$3')
          .split(/\r?\n/);
      })
      .flat();
  }
  // console.log(allLines);

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
    } as {
      currentIdx: number;
      chunks: string[][];
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
