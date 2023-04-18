const cases = [
  [
    `0130004    00071EUR2 00010139479  280323                                                  0000003445691I`,
    {
      record_code: '01',
      bank_code: '30004',
      desk_code: '00071',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010139479',
      prev_date: '2023-03-28',
      prev_amount: '344569.19',
    },
  ],
  [
    `0130004    00823EUR2 00010738652  280323                                                  0000000008653O`,
    {
      record_code: '01',
      bank_code: '30004',
      desk_code: '00823',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010738652',
      prev_date: '2023-03-28',
      prev_amount: '-865.36',
    },
  ],
  [
    `0130004    00585EUR2 00010156142  280323                                                  0000006564827I`,
    {
      record_code: '01',
      bank_code: '30004',
      desk_code: '00585',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010156142',
      prev_date: '2023-03-28',
      prev_amount: '656482.79',
    },
  ],
  [
    `0118020    00001EUR2 00410GXLT01  060423                                                  0000000012258N`,
    {
      record_code: '01',
      bank_code: '18020',
      desk_code: '00001',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00410GXLT01',
      prev_date: '2023-04-06',
      prev_amount: '-1225.85',
    },
  ],
  [
    `0130004    00822EUR2 00010898395  160222                                                  0000000566672H                `,
    {
      record_code: '01',
      bank_code: '30004',
      desk_code: '00822',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010898395',
      prev_date: '2022-02-16',
      prev_amount: '56667.28',
    },
  ],
];

describe('ebics header parser', function () {
  let parse = require('./index');

  test.each(cases)('case %#', (text, expected) => {
    expect(parse(text.split(/(\s+)/))).toEqual(expected);
  });
});
