export default function ({ qualifier, additional_info, ...restTransaction }) {
  const transaction: any = {};

  switch (qualifier) {
    case 'CBE':
      transaction.creditor_account = additional_info;
      break;
    case 'IBE':
      transaction.creditor_id = additional_info.slice(0, 35);
      transaction.creditor_id_type = additional_info.slice(35);
      break;
    case 'IBU':
      transaction.ultimate_creditor_id = additional_info.slice(0, 35);
      transaction.ultimate_creditor_type = additional_info.slice(35);
      break;
    case 'IPO':
      transaction.ultimate_debtor_id = additional_info.slice(0, 35);
      transaction.ultimate_debtor_id_type = additional_info.slice(35);
      break;
    case 'IPY':
      transaction.debtor_id = additional_info.slice(0, 35);
      transaction.debtor_type = additional_info.slice(35);
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
      transaction.currency_code = additional_info.slice(0, 3);
      transaction.nb_of_dec_amount = additional_info.slice(3, 4);
      transaction.equivalent_amount = additional_info.slice(4, 18);
      transaction.nb_of_dec_exchange_rate = additional_info.slice(18, 20);
      transaction.exchange_rate = additional_info.slice(20, 31);
      transaction._ = additional_info.slice(31);
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
      transaction.end2end_identification = additional_info.slice(0, 35);
      transaction.purpose = additional_info.slice(35);
      break;
    case 'REF':
      transaction.payment_infor_id = additional_info.slice(0, 35);
      transaction.instruction_id = additional_info.slice(35);
      break;
    case 'RUM':
      transaction.mandate_identification = additional_info.slice(0, 35);
      transaction.sequence_type = additional_info.slice(35);
      break;
    default:
      transaction[qualifier] = additional_info;
  }

  return { ...transaction, ...restTransaction };
}
