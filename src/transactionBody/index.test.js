const cases = [
  [
    `0530004056800585EUR2 0001015614218290323     NPYDOMUSVI`,
    {
      _1: '',
      _2: '',
      record_code: '05',
      bank_code: '30004',
      internal_code: '0568',
      desk_code: '00585',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010156142',
      operation_code: '18',
      operation_date: '2023-03-29',
      debtor_name: 'DOMUSVI',
    },
  ],
  [
    `0518020404100001EUR2 00410GXLT0121070423  050423URN 5335098    VIREMENT N 53350`,
    {
      423: 'URN 5335098    VIREMENT N 53350',
      _1: '',
      _2: '050',
      account_nb: '00410GXLT01',
      bank_code: '18020',
      currency_code: 'EUR',
      desk_code: '00001',
      internal_code: '4041',
      nb_of_dec: '2',
      operation_code: '21',
      operation_date: '2023-04-07',
      record_code: '05',
    },
  ],
  [
    `0518020312600001EUR2 00410GXLT0167070423  050423INANCEMENT   VIREMENT N 5335098`,
    {
      423: 'INANCEMENT   VIREMENT N 5335098',
      _1: '',
      _2: '050',
      account_nb: '00410GXLT01',
      bank_code: '18020',
      currency_code: 'EUR',
      desk_code: '00001',
      internal_code: '3126',
      nb_of_dec: '2',
      operation_code: '67',
      operation_date: '2023-04-07',
      record_code: '05',
    },
  ],
  [
    `0518020648900001EUR2 00410GXLT0191030323 030323`,
    {
      _1: '',
      _2: '0303',
      account_nb: '00410GXLT01',
      bank_code: '18020',
      currency_code: 'EUR',
      desk_code: '00001',
      internal_code: '6489',
      nb_of_dec: '2',
      operation_code: '91',
      operation_date: '2023-03-03',
      record_code: '05',
    },
  ],
];

describe('ebics transaction body parser', function () {
  let parse = require('./index');

  test.each(cases)('case %#', (text, expected) => {
    expect(parse(text)).toEqual(expected);
  });
});
