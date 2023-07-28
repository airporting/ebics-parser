const { format, parse } = require('date-fns');

const getAmount = require('../amount');

module.exports = (text) => {
  const transaction = {};
  const problems = [];

  const parts = [
    {
      field: 'record_code',
      regex: '0[3,4]',
    },
    {
      field: 'bank_code',
      regex: '[0-9]{5}',
      required: true,
    },
    {
      field: 'internal_code',
      regex: '[a-zA-Z0-9 ]{4}',
    },
    {
      field: 'desk_code',
      regex: '[0-9]{5}',
      required: true,
    },
    {
      field: 'currency_code',
      regex: '[a-zA-Z0-9 ]{3}',
      required: true,
    },
    {
      field: 'nb_of_dec',
      regex: '[0-9 ]{1}',
      required: true,
    },
    {
      field: '_1',
      regex: '[a-zA-Z0-9 ]{1}',
    },
    {
      field: 'account_nb',
      regex: '[a-zA-Z0-9 ]{11}',
      required: true,
    },
    {
      field: 'operation_code',
      regex: '[a-zA-Z0-9 ]{1,2}',
    },
    {
      field: 'operation_date',
      regex: '[0-9]{6}',
      transformer: (value) => {
        return format(parse(value, 'ddMMyy', new Date()), 'yyyy-MM-dd');
      },
      required: true,
    },
    {
      field: 'reject_code',
      regex: '[0-9 ]{1,2}',
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
      required: true,
    },
    {
      field: '_2',
      regex: '.{1,2}',
    },
    {
      field: 'reference',
      regex: '.{7}',
      required: true,
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
      required: true,
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

  parts.forEach(({ field, transformer, required }, idx) => {
    if (transformer) {
      transaction[field] = transformer(matching[idx + 1], transaction);
    } else {
      transaction[field] = matching[idx + 1]?.trim();
    }
    if (required && !transaction[field]) {
      problems.push(`transaction header missing part "${field}"`);
    }
  });

  return {
    transaction,
    problems,
  };
};
