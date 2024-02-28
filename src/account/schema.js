const Joi = require('joi').defaults((schema) =>
  schema.options({
    presence: 'required',
    convert: true,
  })
);

module.exports = () => {
  const transactionSchema = Joi.object({
    record_code: Joi.valid('04'),
    bank_code: Joi.string(),
    operation_date: Joi.string(),
    desk_code: Joi.string(),
    currency_code: Joi.string(),
    nb_of_dec: Joi.string(),
    nb_of_dec_amount: Joi.string().empty('').optional(),
    equivalent_amount: Joi.string().empty('').optional(),
    nb_of_dec_exchange_rate: Joi.string().empty('').optional(),
    exchange_rate: Joi.string().empty('').optional(),
    account_nb: Joi.string(),
    reject_code: Joi.string().empty('').optional(),
    value_date: Joi.string(),
    label: Joi.string().empty(''),
    reference: Joi.string().empty('').optional(),
    exempt_code: Joi.string().empty('').optional(),
    amount: Joi.string(),
    creditor_id: Joi.string().empty('').optional(),
    creditor_id_type: Joi.string().empty('').optional(),
    creditor_name: Joi.string().empty('').optional(),
    creditor_ref_information: Joi.string().empty('').optional(),
    ultimate_creditor_id: Joi.string().empty('').optional(),
    ultimate_creditor_id_type: Joi.string().empty('').optional(),
    ultimate_creditor_name: Joi.string().empty('').optional(),
    creditor_account: Joi.string().empty('').optional(),
    debtor_id: Joi.string().empty('').optional(),
    debtor_id_type: Joi.string().empty('').optional(),
    debtor_type: Joi.string().empty('').optional(),
    debtor_name: Joi.string().empty('').optional(),
    ultimate_debtor_id: Joi.string().empty('').optional(),
    ultimate_debtor_id_type: Joi.string().empty('').optional(),
    ultimate_debtor_name: Joi.string().empty('').optional(),
    remittance_information_1: Joi.string().empty('').optional(),
    remittance_information_2: Joi.string().empty('').optional(),
    end2end_identification: Joi.string().empty('').optional(),
    purpose: Joi.string().empty('').optional(),
    payment_infor_id: Joi.string().empty('').optional(),
    instruction_id: Joi.string().empty('').optional(),
    mandate_identification: Joi.string().empty('').optional(),
    sequence_type: Joi.string().empty('').optional(),
    internal_code: Joi.string().empty('').optional(),
    operation_code: Joi.when('internal_code', {
      is: '',
      then: Joi.string(),
      otherwise: Joi.string().empty('').optional(),
    }),
  }).unknown();

  return Joi.object({
    amounts: Joi.object({
      diff: Joi.number().optional(),
      end: Joi.number().optional(),
      start: Joi.number().optional(),
      transactions: Joi.number().optional(),
    }).unknown(),
    header: Joi.object({
      record_code: Joi.valid('01'),
      bank_code: Joi.string(),
      desk_code: Joi.string(),
      currency_code: Joi.string(),
      nb_of_dec: Joi.string(),
      account_nb: Joi.string(),
      prev_date: Joi.string(),
      prev_amount: Joi.string(),
      _1: Joi.string().empty('').optional(),
      _2: Joi.string().empty('').optional(),
      _3: Joi.string().empty('').optional(),
      _4: Joi.string().empty('').optional(),
      _5: Joi.string().empty('').optional(),
    }),
    footer: Joi.object({
      record_code: Joi.valid('07'),
      bank_code: Joi.string(),
      desk_code: Joi.string(),
      currency_code: Joi.string(),
      nb_of_dec: Joi.string(),
      account_nb: Joi.string(),
      next_date: Joi.string(),
      next_amount: Joi.string(),
      _1: Joi.string().empty('').optional(),
      _2: Joi.string().empty('').optional(),
      _3: Joi.string().empty('').optional(),
      _4: Joi.string().empty('').optional(),
      _5: Joi.string().empty('').optional(),
    }),
    transactions: Joi.array().items(transactionSchema),
    problems: Joi.array()
      .items(
        Joi.object({
          message: Joi.string(),
          line: Joi.string().optional(),
          details: Joi.any().optional(),
        })
      )
      .allow(null),
  });
};
