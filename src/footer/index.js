const { parse, format } = require('date-fns');
const getAmount = require('../amount');
module.exports = function (words) {
  const footer = {};

  words.forEach((preword, idxWord) => {
    const word = preword.replace(/\s/g, '');

    let matching;
    if (word.length !== 0) {
      switch (idxWord) {
        case 0:
          matching = word.match(/(07)([0-9]{5})/);

          if (matching) {
            footer.record_code = matching[1];
            footer.bank_code = matching[2];
          }
          break;
        case 2:
          matching = word.match(/([0-9]{5,})([A-Z]{3})([0-9]{1})/);

          if (matching) {
            footer.desk_code = matching[1];
            footer.currency_code = matching[2];
            // Number of decimal
            footer.nb_of_dec = matching[3];
          }
          break;
        case 4:
          footer.account_nb = word;
          break;
        case 6:
          footer.next_date = format(
            parse(word, 'ddMMyy', new Date()),
            'yyyy-MM-dd'
          );
          break;
        case 8:
          footer.next_amount = getAmount(word, footer.nb_of_dec);
          break;
      }
    }
  });

  return footer;
};
