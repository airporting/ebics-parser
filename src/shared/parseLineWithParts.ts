import type { ParsedTransactionFields, TransactionFields } from '@/src/transaction';

export type FieldPart = {
  field: keyof TransactionFields;
  regex: string;
  required?: boolean;
  transformer?: (value: string, record: ParsedTransactionFields) => string;
};

/**
 * Parse a fixed-format EBICS line using an ordered list of field definitions.
 * Each field is captured by a regex group. If the full regex fails, fields are
 * progressively removed from the end until a match is found.
 *
 * @returns The matched field values and the parts that were actually matched.
 */
export function parseLineWithParts(
  text: string,
  parts: FieldPart[],
): { record: ParsedTransactionFields; matchedParts: FieldPart[] } | null {
  const workingParts = [...parts];

  const buildRegex = (p: FieldPart[]) =>
    new RegExp(p.map(({ regex }) => `(${regex})`).join(''));

  let matching = text.match(buildRegex(workingParts));

  if (!matching) {
    workingParts.pop(); // remove trailing wildcard first

    while (workingParts.length) {
      workingParts.pop();

      const tryMatching = text.match(buildRegex(workingParts));
      if (tryMatching) {
        matching = tryMatching;
        break;
      }
    }
  }

  if (!matching) {
    return null;
  }

  const record: ParsedTransactionFields = {};

  workingParts.forEach(({ field, transformer }, idx) => {
    if (transformer) {
      record[field] = transformer(matching[idx + 1], record);
    } else {
      record[field] = matching[idx + 1]?.trim();
    }
  });

  return { record, matchedParts: workingParts };
}
