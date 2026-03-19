import { format, parse } from 'date-fns';

import type { ParsedTransactionFields } from '@/src/transaction';

import { getAmount } from '../amount/';
import { type FieldPart, parseLineWithParts } from '../shared/parseLineWithParts';

export type ParsedTransactionHeader = {
  transaction: ParsedTransactionFields;
  problems: { message: string; line: string }[];
};

const transactionHeaderParts: FieldPart[] = [
  { field: 'record_code', regex: '0[3,4]' },
  { field: 'bank_code', regex: '[0-9]{5}', required: true },
  { field: 'internal_code', regex: '[a-zA-Z0-9 ]{4}' },
  { field: 'desk_code', regex: '[0-9]{5}', required: true },
  { field: 'currency_code', regex: '[a-zA-Z0-9 ]{3}', required: true },
  { field: 'nb_of_dec', regex: '[0-9 ]{1}', required: true },
  { field: '_1', regex: '[a-zA-Z0-9 ]{1}' },
  { field: 'account_nb', regex: '[a-zA-Z0-9 ]{11}', required: true },
  { field: 'operation_code', regex: '[a-zA-Z0-9 ]{1,2}' },
  {
    field: 'operation_date',
    regex: '[0-9]{6}',
    transformer: (value: string) =>
      format(parse(value, 'ddMMyy', new Date()), 'yyyy-MM-dd'),
    required: true,
  },
  { field: 'reject_code', regex: '[0-9 ]{1,2}' },
  {
    field: 'value_date',
    regex: '[0-9]{6}',
    transformer: (value: string) =>
      format(parse(value, 'ddMMyy', new Date()), 'yyyy-MM-dd'),
  },
  { field: 'label', regex: '.{31}', required: true },
  { field: '_2', regex: '.{1,2}' },
  { field: 'reference', regex: '.{7}' },
  { field: 'exempt_code', regex: '.' },
  { field: '_3', regex: '.' },
  {
    field: 'amount',
    regex: '[0-9]{13}[A-R{}]',
    transformer: (value, header) =>
      getAmount(value, Number.parseInt(header.nb_of_dec ?? '2')),
    required: true,
  },
  { field: '_4:', regex: '.*' },
];

/**
 * Parse an EBICS transaction header line (record code 04, or 03 as variant).
 * Extracts operation details, dates, label, reference, and amount.
 */
export function transactionHeaderParser(
  text: string,
): ParsedTransactionHeader {
  const problems: ParsedTransactionHeader['problems'] = [];

  const result = parseLineWithParts(text, transactionHeaderParts);

  if (!result) {
    return {
      transaction: {},
      problems: [
        { message: 'Could not match header line with regex', line: text },
      ],
    };
  }

  const transaction = result.record;

  result.matchedParts.forEach(({ field, required }) => {
    if (required && !transaction[field]) {
      problems.push({ message: `Missing required field: ${field}`, line: text });
    }
  });

  return { transaction, problems };
}
