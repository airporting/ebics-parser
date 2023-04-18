const { format, parse } = require('date-fns');

const getAmount = require('../amount');

module.exports = (text) => {
  const transaction = {};

  // TODO: to split into array like in transactionBody
  const regex =
    /(04)([0-9]{5})([a-zA-Z0-9 ]{4})([0-9]{5})([a-zA-Z ]{3})([0-9 ])(.)([a-zA-Z0-9]{11})([a-zA-Z0-9]{2})([0-9]{6})([0-9 ]{2})([0-9]{6})(.{31})(.{2})(.{7})(.)(.)([0-9]{13}[A-R{}])(.{0,16})/;
  const matching = text.match(regex);

  if (matching) {
    transaction.record_code = matching[1];
    transaction.bank_code = matching[2];
    transaction.internal_code = matching[3];
    transaction.desk_code = matching[4];
    transaction.currency_code = matching[5];
    transaction.nb_of_dec = matching[6];
    transaction._1 = matching[7]?.trim();
    transaction.account_nb = matching[8];
    transaction.operation_code = matching[9];
    transaction.operation_date = format(
      parse(matching[10], 'ddMMyy', new Date()),
      'yyyy-MM-dd'
    );
    transaction.reject_code = matching[11]?.trim();
    transaction.value_date = format(
      parse(matching[12], 'ddMMyy', new Date()),
      'yyyy-MM-dd'
    );
    transaction.label = matching[13]?.trim();
    transaction._2 = matching[14]?.trim();
    transaction.reference = matching[15]?.trim();
    transaction.exempt_code = matching[16]?.trim();
    transaction._3 = matching[17]?.trim();
    transaction.amount = getAmount(matching[18], transaction.nb_of_dec);
    transaction['_4:'] = matching[19]?.trim();
  } else {
    //TODO: before throw try to match maximum elements using the minimum viable regex

    throw 'transaction header malformed';
  }

  return transaction;
};
