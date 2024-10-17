import { accountParser } from '@/src/account';

export default function (text: string) {
  let allLines = text
    // prise en compte des retours à la ligne
    .split(/\r?\n/)
    // éviter les lignes vides
    .filter((line) => line.replace(/ /g, '') !== '')
    // retirer les espaces vides en début de ligne
    .map((line) => line.trimStart());

  console.log({ countLines: allLines.length });

  if (allLines.every((currentLine) => currentLine.startsWith('01'))) {
    const temporarySet = [];

    for (const currentLine of allLines) {
      let exploitedLine = currentLine;
      // only uppercase letters authorized, don't add flag i at end of regexp please
      // if you add it, you're fired
      const allAccountsMarkers =
        exploitedLine.match(
          /0[13457][0-9 ]{14}[A-Z]{3}[0-9].[0-9{}ABCDEFGHIJKLMNOPQR ]{13}[0-9]{6}/g
        ) ?? [];
      // console.log({ allAccountsMarkers });

      for (let iter = 1; iter < allAccountsMarkers.length; iter += 1) {
        let endPosition = exploitedLine.indexOf(allAccountsMarkers[iter], 0);
        if (
          !endPosition &&
          ['03', '04', '05'].includes(exploitedLine.substring(0, 2))
        ) {
          endPosition = exploitedLine.indexOf(allAccountsMarkers[iter], 1);
        }
        // console.log({
        //   iter,
        //   markerEnd: allAccountsMarkers[iter],
        //   endPosition,
        //   exploitedLine,
        // });

        // get the next statement
        temporarySet.push(exploitedLine.slice(0, endPosition));

        // remove the statement put in temporary set
        exploitedLine = exploitedLine.slice(endPosition);
      }
      temporarySet.push(exploitedLine);
      // console.log({ temporarySet });
    }
    allLines = temporarySet;
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
    } as {
      currentIdx: number;
      chunks: string[][];
    }
  );
  const chunksByAccount = reduced.chunks;

  try {
    return chunksByAccount.map((chunk) => accountParser(chunk));
  } catch (err) {
    if (!chunksByAccount) {
      throw 'Header, or footer, missing or malformed';
    } else {
      throw err;
    }
  }
}
