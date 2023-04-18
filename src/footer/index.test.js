const cases = [
  [
    `0730004    00071EUR2 00010139479  290323                                                  0000003445691I`,
    {
      record_code: '07',
      bank_code: '30004',
      desk_code: '00071',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010139479',
      next_date: '2023-03-29',
      next_amount: '344569.19',
    },
  ],
  [
    `0730004    00823EUR2 00010738652  290323                                                  0000000008653O`,
    {
      record_code: '07',
      bank_code: '30004',
      desk_code: '00823',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010738652',
      next_date: '2023-03-29',
      next_amount: '-865.36',
    },
  ],
  [
    `0730004    00585EUR2 00010156142  290323                                                  0000006363387I`,
    {
      record_code: '07',
      bank_code: '30004',
      desk_code: '00585',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010156142',
      next_date: '2023-03-29',
      next_amount: '636338.79',
    },
  ],
];

describe('ebics footer parser', function () {
  let parse = require('./index');

  test.each(cases)('case %#', (text, expected) => {
    expect(parse(text.split(/(\s+)/))).toEqual(expected);
  });
});
