import { accountParser } from '@/src/account';

/**
 * Parse an EBICS file content into structured account data.
 * Handles multiplexed lines (multiple accounts per line) and
 * splits the input into per-account chunks before parsing.
 *
 * @param text - Raw EBICS file content
 * @returns Array of parsed account objects
 */
export default function (text: string) {
  let allLines = text
    .split(/\r?\n/)
    .filter((line) => line.replace(/ /g, '') !== '')
    .map((line) => line.trimStart());

  if (allLines.every((currentLine) => currentLine.startsWith('01'))) {
    allLines = demultiplexLines(allLines);
  }

  const chunksByAccount = chunkLinesByAccount(allLines);

  return chunksByAccount.map((chunk) => accountParser(chunk));
}

/**
 * Split multiplexed lines where multiple records are concatenated
 * on a single line (no line breaks between records).
 */
function demultiplexLines(lines: string[]): string[] {
  const result: string[] = [];

  // only uppercase letters authorized, don't add flag i at end of regexp please
  const markerRegex =
    /0[13457][0-9 ]{14}[A-Z]{3}[0-9]\.[0-9{}ABCDEFGHIJKLMNOPQR ]{13}[0-9]{6}/g;

  for (const currentLine of lines) {
    let exploitedLine = currentLine;
    const allAccountsMarkers = exploitedLine.match(markerRegex) ?? [];

    for (let iter = 1; iter < allAccountsMarkers.length; iter += 1) {
      let endPosition = exploitedLine.indexOf(allAccountsMarkers[iter], 0);
      if (
        !endPosition &&
        ['03', '04', '05'].includes(exploitedLine.substring(0, 2))
      ) {
        endPosition = exploitedLine.indexOf(allAccountsMarkers[iter], 1);
      }

      result.push(exploitedLine.slice(0, endPosition));
      exploitedLine = exploitedLine.slice(endPosition);
    }
    result.push(exploitedLine);
  }

  return result;
}

/**
 * Group lines into chunks, one per account.
 * Each chunk starts with a '01' header line.
 */
function chunkLinesByAccount(allLines: string[]): string[][] {
  const chunks: string[][] = [];
  let currentIdx = -1;

  for (const line of allLines) {
    if (line.startsWith('01')) {
      currentIdx += 1;
      chunks.push([line]);
    } else {
      chunks[currentIdx].push(line);
    }
  }

  return chunks;
}
