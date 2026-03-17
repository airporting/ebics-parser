import { z } from 'zod';

const optionalString = z.string().optional();

const transactionSchema = z
  .object({
    record_code: z.literal('04'),
    bank_code: z.string(),
    operation_date: z.string(),
    desk_code: z.string(),
    currency_code: z.string(),
    nb_of_dec: z.string(),
    nb_of_dec_amount: optionalString,
    equivalent_amount: optionalString,
    nb_of_dec_exchange_rate: optionalString,
    exchange_rate: optionalString,
    account_nb: z.string(),
    reject_code: optionalString,
    value_date: z.string(),
    label: z.string().optional(),
    reference: optionalString,
    exempt_code: optionalString,
    amount: z.string(),
    creditor_id: optionalString,
    creditor_id_type: optionalString,
    creditor_name: optionalString,
    creditor_ref_information: optionalString,
    ultimate_creditor_id: optionalString,
    ultimate_creditor_id_type: optionalString,
    ultimate_creditor_name: optionalString,
    creditor_account: optionalString,
    debtor_id: optionalString,
    debtor_id_type: optionalString,
    debtor_type: optionalString,
    debtor_name: optionalString,
    ultimate_debtor_id: optionalString,
    ultimate_debtor_id_type: optionalString,
    ultimate_debtor_name: optionalString,
    remittance_information_1: optionalString,
    remittance_information_2: optionalString,
    end2end_identification: optionalString,
    purpose: optionalString,
    payment_infor_id: optionalString,
    instruction_id: optionalString,
    mandate_identification: optionalString,
    sequence_type: optionalString,
    internal_code: optionalString,
    operation_code: optionalString,
  })
  .catchall(z.unknown());

export function schema() {
  return z.object({
    details: z.object({
      countTransactions: z.number().default(0),
    }),
    amounts: z
      .object({
        diff: z.number().optional(),
        end: z.number().optional(),
        start: z.number().optional(),
        transactions: z.number().optional(),
      })
      .passthrough(),
    header: z.object({
      record_code: z.literal('01'),
      bank_code: z.string(),
      desk_code: z.string(),
      currency_code: z.string(),
      nb_of_dec: z.string(),
      account_nb: z.string(),
      prev_date: z.string(),
      prev_amount: z.string(),
      _1: optionalString,
      _2: optionalString,
      _3: optionalString,
      _4: optionalString,
      _5: optionalString,
    }),
    footer: z.object({
      record_code: z.literal('07'),
      bank_code: z.string(),
      desk_code: z.string(),
      currency_code: z.string(),
      nb_of_dec: z.string(),
      account_nb: z.string(),
      next_date: z.string(),
      next_amount: z.string(),
      _1: optionalString,
      _2: optionalString,
      _3: optionalString,
      _4: optionalString,
      _5: optionalString,
    }),
    transactions: z.array(transactionSchema),
    problems: z
      .array(
        z.object({
          message: z.string(),
          line: z.string().optional(),
          details: z.any().optional(),
        })
      )
      .nullable(),
  });
}
