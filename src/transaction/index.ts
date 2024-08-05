export type TransactionFields = {
  record_code: string;
  bank_code: string;
  internal_code: string;
  desk_code: string;
  currency_code: string;
  nb_of_dec: string;
  account_nb: string;
  operation_code: string;
  operation_date: string;
  reject_code: string;
  value_date: string;
  label: string;
  reference: string;
  exempt_code: string;
  amount: string;
  prev_amount: string;
  prev_date: string;
  qualifier: QualifierType;
  additional_info: string;
  next_date: string;
  next_amount: string;
  _1: string;
  _2: string;
  _3: string;
  _4: string;
  '_4:': string;
  _5: string;
  _rank: string;
};

export type ParsedTransactionFields = Partial<
  Record<keyof TransactionFields, string>
>;

export type QualifierType =
  | 'CBE'
  | 'IBE'
  | 'IBU'
  | 'IPO'
  | 'IPY'
  | 'LCC'
  | 'LC2'
  | 'LCS'
  | 'LIB'
  | 'MMO'
  | 'NBE'
  | 'NBU'
  | 'NPO'
  | 'NPY'
  | 'PDO'
  | 'RCN'
  | 'REF'
  | 'RUM';
