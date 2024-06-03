import { format, parse } from 'date-fns';

import type {
  ParsedTransactionFields,
  TransactionFields,
} from '@/src/transaction';

import { getAmount } from '../amount/';

export function footerParser(text: string): ParsedTransactionFields {
  const footer: ParsedTransactionFields = {};

  const parts: {
    field: keyof TransactionFields;
    regex: string;
    transformer?: (value: string, footer: ParsedTransactionFields) => string;
  }[] = [
    {
      field: 'record_code',
      regex: '07',
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
      field: 'next_date',
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
      field: 'next_amount',
      regex: '[0-9]{13}[A-R{}]',
      transformer: (value, footer) => {
        return getAmount(value, Number.parseInt(footer.nb_of_dec ?? '2'));
      },
    },
    {
      field: '_5',
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

  if (!matching) {
    throw 'Footer, or header, missing or malformed';
  }

  parts.forEach(({ field, transformer }, idx) => {
    if (transformer) {
      footer[field] = transformer(matching[idx + 1], footer);
    } else {
      footer[field] = matching[idx + 1]?.trim();
    }
  });

  return footer;
}
