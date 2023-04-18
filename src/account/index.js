const transactionHeaderParser = require('../transactionHeader');
const transactionBodyParser = require('../transactionBody');
const headerParser = require('../header');
const footerParser = require('../footer');

module.exports = function chunkParser(allLines) {
  let header = {};
  let footer = {};
  const transactionsList = [];
  let currentTransaction = null;
  const problems = [];

  allLines.forEach((line) => {
    if (!line.length) {
      return;
    }

    try {
      const lineQualifier = line.slice(0, 2);

      if (lineQualifier === '04') {
        if (currentTransaction) {
          transactionsList.push(currentTransaction);
        }
        currentTransaction = transactionHeaderParser(line);

        return;
      }

      if (lineQualifier === '05') {
        const transaction = transactionBodyParser(line);

        currentTransaction = {
          ...currentTransaction,
          ...transaction,
          record_code: '04',
        };

        return;
      }

      if (lineQualifier === '01') {
        header = headerParser(line.split(/(\s+)/));
        return;
      }

      if (lineQualifier === '07') {
        if (currentTransaction) {
          transactionsList.push(currentTransaction);
        }
        footer = footerParser(line.split(/(\s+)/));
        return;
      }

      problems.push({
        message: 'Wrong line qualifier',
        line,
      });
      console.log('line parser not implemented', {
        line,
        lineQualifier,
      });
    } catch (err) {
      problems.push({
        message: err,
        line,
      });
    }
  });

  return {
    header,
    footer,
    transactions: transactionsList,
    problems: problems.length ? problems : null,
  };
};
