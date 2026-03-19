import { format, parse } from 'date-fns';

import type { ParsedTransactionFields } from '@/src/transaction';

import { type FieldPart, parseLineWithParts } from '../shared/parseLineWithParts';
import qualifierResolver from './qualifier/';

const transactionBodyParts: FieldPart[] = [
  { field: 'record_code', regex: '05' },
  { field: 'bank_code', regex: '[0-9 ]{5}' },
  { field: 'internal_code', regex: '[a-zA-Z0-9 ]{4}' },
  { field: 'desk_code', regex: '[0-9 ]{5}' },
  { field: 'currency_code', regex: '[a-zA-Z0-9 ]{3}' },
  { field: 'nb_of_dec', regex: '[0-9 ]{1}' },
  { field: '_1', regex: '[a-zA-Z0-9 ]{1}' },
  { field: 'account_nb', regex: '[a-zA-Z0-9 ]{11}' },
  { field: 'operation_code', regex: '[a-zA-Z0-9 ]{2}' },
  {
    field: 'operation_date',
    regex: '[0-9]{6}',
    transformer: (value) =>
      format(parse(value, 'ddMMyy', new Date()), 'yyyy-MM-dd'),
  },
  { field: '_2', regex: '.{5}' },
  { field: 'qualifier', regex: '[a-zA-Z0-9 ]{3}' },
  { field: 'additional_info', regex: '.*' },
];

/**
 * Parse an EBICS transaction body line (record code 05).
 * Extracts qualifier and additional info, then resolves
 * the qualifier into structured SEPA fields.
 */
export function transactionBodyParser(text: string): ParsedTransactionFields {
  const result = parseLineWithParts(text, transactionBodyParts);

  if (!result) {
    throw new Error('Could not parse transaction body');
  }

  return qualifierResolver(result.record);
}
