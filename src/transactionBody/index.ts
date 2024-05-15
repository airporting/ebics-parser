import { format, parse } from 'date-fns';

import qualifierResolver from './qualifier';
import { ParsedTransactionFields, TransactionFields } from '@/src/transaction';

export default function (text: string) {
  const transaction: ParsedTransactionFields = {};

  const parts: {
    field: keyof TransactionFields;
    regex: string;
    transformer?: (
      value: string,
      transaction: ParsedTransactionFields
    ) => string;
  }[] = [
    {
      field: 'record_code',
      regex: '05',
    },
    {
      field: 'bank_code',
      regex: '[0-9 ]{5}',
    },
    {
      field: 'internal_code',
      regex: '[a-zA-Z0-9 ]{4}',
    },
    {
      field: 'desk_code',
      regex: '[0-9 ]{5}',
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
      regex: '[a-zA-Z0-9 ]{11}',
    },
    {
      field: 'operation_code',
      regex: '[a-zA-Z0-9 ]{2}',
    },
    {
      field: 'operation_date',
      regex: '[0-9]{6}',
      transformer: (value) => {
        return format(parse(value, 'ddMMyy', new Date()), 'yyyy-MM-dd');
      },
    },
    {
      field: '_2',
      regex: '.{5}',
    },
    {
      field: 'qualifier',
      regex: '[a-zA-Z0-9 ]{3}',
    },
    {
      field: 'additional_info',
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
    throw 'Could not parse transaction body';
  }

  parts.forEach(({ field, transformer }, idx) => {
    if (transformer) {
      transaction[field] = transformer(matching[idx + 1], transaction);
    } else {
      transaction[field] = matching[idx + 1]?.trim();
    }
  });

  const resolved = qualifierResolver(transaction);

  return resolved;
}
