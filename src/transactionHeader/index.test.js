const cases = [
  [
    `0430004056800585EUR2 0001015614218290323  290323DOMUSVI                          0000000  0000000359190{`,
    {
      _1: '',
      _2: '',
      _3: '',
      '_4:': '',
      record_code: '04',
      bank_code: '30004',
      internal_code: '0568',
      desk_code: '00585',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010156142',
      operation_code: '18',
      operation_date: '2023-03-29',
      reject_code: '',
      value_date: '2023-03-29',
      label: 'DOMUSVI',
      reference: '0000000',
      exempt_code: '',
      amount: '35919',
    },
  ],
  [
    `0430004081800585EUR2 00010156142B2290323  290323PRLV SEPA/DGFIP IMPOT                   0 0000000560630}FR46ZZZ005002`,
    {
      _1: '',
      _2: '',
      _3: '',
      record_code: '04',
      bank_code: '30004',
      internal_code: '0818',
      desk_code: '00585',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010156142',
      operation_code: 'B2',
      operation_date: '2023-03-29',
      reject_code: '',
      value_date: '2023-03-29',
      label: 'PRLV SEPA/DGFIP IMPOT',
      reference: '',
      exempt_code: '0',
      amount: '-56063',
      '_4:': 'FR46ZZZ005002',
    },
  ],
  [
    `0418020404100001EUR2 00410GXLT0121070423  050423VIREMENT BANCAIRE EN VOTRE FAVE  3175387 00000000594363K000070`,
    {
      _1: '',
      _2: '',
      _3: '0',
      record_code: '04',
      bank_code: '18020',
      internal_code: '4041',
      desk_code: '00001',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00410GXLT01',
      operation_code: '21',
      operation_date: '2023-04-07',
      reject_code: '',
      value_date: '2023-04-05',
      label: 'VIREMENT BANCAIRE EN VOTRE FAVE',
      reference: '3175387',
      exempt_code: '',
      amount: '-59436.32',
      '_4:': '000070',
    },
  ],
];

describe('ebics transaction header parser', function () {
  let parse = require('./index');

  test.each(cases)('case %#', (text, expected) => {
    expect(parse(text)).toEqual(expected);
  });
});
