import type { ParsedTransactionFields } from '@/src/transaction';

export type ParsedTransaction = {
  creditor_account?: string;
  creditor_id?: string;
  creditor_id_type?: string;
  ultimate_creditor_id?: string;
  ultimate_creditor_type?: string;
  ultimate_debtor_id?: string;
  ultimate_debtor_id_type?: string;
  debtor_id?: string;
  debtor_type?: string;
  remittance_information_1?: string;
  remittance_information_2?: string;
  creditor_ref_information?: string;
  label?: string;
  currency_code?: string;
  nb_of_dec_amount?: string;
  equivalent_amount?: string;
  nb_of_dec_exchange_rate?: string;
  exchange_rate?: string;
  _?: string;
  creditor_name?: string;
  ultimate_creditor_name?: string;
  ultimate_debtor_name?: string;
  debtor_name?: string;
  PDO?: string;
  end2end_identification?: string;
  purpose?: string;
  payment_infor_id?: string;
  instruction_id?: string;
  mandate_identification?: string;
  sequence_type?: string;
  [key: string]: string | undefined;
} & Omit<ParsedTransactionFields, 'qualifier' | 'additional_info'>;

export default function ({
  qualifier,
  additional_info,
  ...restTransaction
}: ParsedTransactionFields): ParsedTransaction {
  const transaction: Partial<ParsedTransaction> = {};

  switch (qualifier) {
    case 'CBE':
      transaction.creditor_account = additional_info;
      break;
    case 'IBE':
      transaction.creditor_id = additional_info?.slice(0, 35);
      transaction.creditor_id_type = additional_info?.slice(35);
      break;
    case 'IBU':
      transaction.ultimate_creditor_id = additional_info?.slice(0, 35);
      transaction.ultimate_creditor_type = additional_info?.slice(35);
      break;
    case 'IPO':
      transaction.ultimate_debtor_id = additional_info?.slice(0, 35);
      transaction.ultimate_debtor_id_type = additional_info?.slice(35);
      break;
    case 'IPY':
      transaction.debtor_id = additional_info?.slice(0, 35);
      transaction.debtor_type = additional_info?.slice(35);
      break;
    case 'LCC':
      transaction.remittance_information_1 = additional_info;
      break;
    case 'LC2':
      transaction.remittance_information_2 = additional_info;
      break;
    case 'LCS':
      transaction.creditor_ref_information = additional_info;
      break;
    case 'LIB':
      transaction.label = additional_info;
      break;
    case 'MMO':
      transaction.currency_code = additional_info?.slice(0, 3);
      transaction.nb_of_dec_amount = additional_info?.slice(3, 4);
      transaction.equivalent_amount = additional_info?.slice(4, 18);
      transaction.nb_of_dec_exchange_rate = additional_info?.slice(18, 20);
      transaction.exchange_rate = additional_info?.slice(20, 31);
      transaction._ = additional_info?.slice(31);
      break;
    case 'NBE':
      transaction.creditor_name = additional_info;
      break;
    case 'NBU':
      transaction.ultimate_creditor_name = additional_info;
      break;
    case 'NPO':
      transaction.ultimate_debtor_name = additional_info;
      break;
    case 'NPY':
      transaction.debtor_name = additional_info;
      break;
    case 'PDO':
      transaction.PDO = additional_info;
      break;
    case 'RCN':
      transaction.end2end_identification = additional_info?.slice(0, 35);
      transaction.purpose = additional_info?.slice(35);
      break;
    case 'REF':
      transaction.payment_infor_id = additional_info?.slice(0, 35);
      transaction.instruction_id = additional_info?.slice(35);
      break;
    case 'RUM':
      transaction.mandate_identification = additional_info?.slice(0, 35);
      transaction.sequence_type = additional_info?.slice(35);
      break;
    default:
      if (qualifier) transaction[qualifier] = additional_info;
  }

  return { ...transaction, ...restTransaction };
}
