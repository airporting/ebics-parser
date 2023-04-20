const { format, parse } = require('date-fns');

const getAmount = require('../amount');

module.exports = (text) => {
  const transaction = {};

  const parts = [
    {
      field: 'record_code',
      regex: '04',
    },
    {
      field: 'bank_code',
      regex: '[0-9]{5}',
    },
    {
      field: 'internal_code',
      regex: '[a-zA-Z0-9 ]{4}',
    },
    {
      field: 'desk_code',
      regex: '[0-9]{5}',
    },
    {
      field: 'currency_code',
      regex: '[a-zA-Z0-9 ]{3}',
    },
    {
      field: 'nb_of_dec',
      regex: '[0-9 ]{1}',
    },
    {
      field: '_1',
      regex: '[a-zA-Z0-9 ]{1}',
    },
    {
      field: 'account_nb',
      regex: '[a-zA-Z0-9]{11}',
    },
    {
      field: 'operation_code',
      regex: '[a-zA-Z0-9]{2}',
    },
    {
      field: 'operation_date',
      regex: '[0-9]{6}',
      transformer: (value) => {
        return format(parse(value, 'ddMMyy', new Date()), 'yyyy-MM-dd');
      },
    },
    {
      field: 'reject_code',
      regex: '[0-9 ]{2}',
    },
    {
      field: 'value_date',
      regex: '[0-9]{6}',
      transformer: (value) => {
        return format(parse(value, 'ddMMyy', new Date()), 'yyyy-MM-dd');
      },
    },
    {
      field: 'label',
      regex: '.{31}',
    },
    {
      field: '_2',
      regex: '.{2}',
    },
    {
      field: 'reference',
      regex: '.{7}',
    },
    {
      field: 'exempt_code',
      regex: '.',
    },
    {
      field: '_3',
      regex: '.',
    },
    {
      field: 'amount',
      regex: '[0-9]{13}[A-R{}]',
      transformer: (value, header) => {
        return getAmount(value, header.nb_of_dec);
      },
    },
    {
      field: '_4:',
      regex: '.*',
    },
  ];

  const regex = new RegExp(parts.map(({ regex }) => `(${regex})`).join(''));
  let matching = text.match(regex);

  if (!matching) {
    parts.pop();

    while (parts.length) {
      parts.pop();

      const tryRegex = new RegExp(
        parts.map(({ regex }) => `(${regex})`).join('')
      );
      const tryMatching = text.match(tryRegex);

      if (tryMatching) {
        matching = tryMatching;
        break;
      }
    }
  }

  parts.forEach(({ field, transformer }, idx) => {
    if (transformer) {
      transaction[field] = transformer(matching[idx + 1], transaction);
    } else {
      transaction[field] = matching[idx + 1]?.trim();
    }
  });

  return transaction;
};
