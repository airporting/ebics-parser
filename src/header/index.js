const { parse, format } = require('date-fns');

const getAmount = require('../amount');

module.exports = function (words) {
  const header = {};

  words.forEach((preword, idxWord) => {
    const word = preword.replace(/\s/g, '');

    let matching;
    if (word.length !== 0) {
      switch (idxWord) {
        case 0:
          matching = word.match(/(01)([0-9]{5})/);

          if (matching) {
            header.record_code = matching[1];
            header.bank_code = matching[2];
          }
          break;
        case 2:
          matching = word.match(/([0-9]{5,})([A-Z]{3})([0-9]{1})/);

          if (matching) {
            header.desk_code = matching[1];
            header.currency_code = matching[2];
            // Number of decimal
            header.nb_of_dec = matching[3];
          }
          break;
        case 4:
          header.account_nb = word;
          break;
        case 6:
          try {
            header.prev_date = format(
              parse(word, 'ddMMyy', new Date()),
              'yyyy-MM-dd'
            );
          } catch (err) {
            console.error({ err, word });
            throw err;
          }
          break;
        case 8:
          header.prev_amount = getAmount(word, header.nb_of_dec);
          break;
      }
    }
  });

  return header;
};
