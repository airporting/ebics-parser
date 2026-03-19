import { format, parse } from 'date-fns';

import type { ParsedTransactionFields } from '@/src/transaction';

import { getAmount } from '../amount/';
import { type FieldPart, parseLineWithParts } from '../shared/parseLineWithParts';

const footerParts: FieldPart[] = [
  { field: 'record_code', regex: '07' },
  { field: 'bank_code', regex: '[0-9]{5}' },
  { field: '_1', regex: '.{4}' },
  { field: 'desk_code', regex: '[0-9]{5}' },
  { field: 'currency_code', regex: '[a-zA-Z0-9 ]{3}' },
  { field: 'nb_of_dec', regex: '[0-9 ]{1}' },
  { field: '_2', regex: '.{1}' },
  { field: 'account_nb', regex: '[a-zA-Z0-9]{11}' },
  { field: '_3', regex: '.{2}' },
  {
    field: 'next_date',
    regex: '[0-9]{6}',
    transformer: (value) =>
      format(parse(value, 'ddMMyy', new Date()), 'yyyy-MM-dd'),
  },
  { field: '_4', regex: '.{50}' },
  {
    field: 'next_amount',
    regex: '[0-9]{13}[A-R{}]',
    transformer: (value, footer) =>
      getAmount(value, Number.parseInt(footer.nb_of_dec ?? '2')),
  },
  { field: '_5', regex: '.*' },
];

/**
 * Parse an EBICS footer line (record code 07).
 * Extracts bank info, account number, date, and closing balance.
 */
export function footerParser(text: string): ParsedTransactionFields {
  const result = parseLineWithParts(text, footerParts);

  if (!result) {
    throw new Error('Footer missing or malformed');
  }

  return result.record;
}
