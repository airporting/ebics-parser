const { parse, format } = require('date-fns');

const getAmount = require('../amount');

module.exports = function (text) {
  const header = {};

  const parts = [
    {
      field: 'record_code',
      regex: '01',
    },
    {
      field: 'bank_code',
      regex: '[0-9]{5}',
    },
    {
      field: '_1',
      regex: '.{4}',
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
      field: '_2',
      regex: '.{1}',
    },
    {
      field: 'account_nb',
      regex: '[a-zA-Z0-9]{11}',
    },
    {
      field: '_3',
      regex: '.{2}',
    },
    {
      field: 'prev_date',
      regex: '[0-9]{6}',
      transformer: (value) => {
        return format(parse(value, 'ddMMyy', new Date()), 'yyyy-MM-dd');
      },
    },
    {
      field: '_4',
      regex: '.{50}',
    },
    {
      field: 'prev_amount',
      regex: '[0-9]{13}[A-R{}]',
      transformer: (value, header) => {
        return getAmount(value, header.nb_of_dec);
      },
    },
    {
      field: '_5',
      regex: '.*',
    },
  ];

  const regex = new RegExp(parts.map(({ regex }) => `(${regex})`).join(''));
  const matching = text.match(regex);

  if (matching) {
    parts.forEach(({ field, transformer }, idx) => {
      if (transformer) {
        header[field] = transformer(matching[idx + 1], header);
      } else {
        header[field] = matching[idx + 1]?.trim();
      }
    });
  } else {
    //TODO: before failing try to match maximum elements using the minimum viable regex
    return {};
  }

  return header;
};
