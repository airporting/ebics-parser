const accountParser = require('./account');

module.exports = function (text) {
  const allLines = text.split(/\r?\n/);
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
};
