import { describe, test, expect } from 'vitest';
import parse from './index';

const cases: [string, Record<string, string>][] = [
  [
    `0730012    00071EUR2 00010139479  290323                                                  0000003445691I`,
    {
      _1: '',
      _2: '',
      _3: '',
      _4: '',
      _5: '',
      record_code: '07',
      bank_code: '30012',
      desk_code: '00071',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010139479',
      next_date: '2023-03-29',
      next_amount: '344569.19',
    },
  ],
  [
    `0730012    00823EUR2 00010738652  290323                                                  0000000008653O`,
    {
      _1: '',
      _2: '',
      _3: '',
      _4: '',
      _5: '',
      record_code: '07',
      bank_code: '30012',
      desk_code: '00823',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010738652',
      next_date: '2023-03-29',
      next_amount: '-865.36',
    },
  ],
  [
    `0730012    00585EUR2 00010156142  290323                                                  0000006363387I`,
    {
      _1: '',
      _2: '',
      _3: '',
      _4: '',
      _5: '',
      record_code: '07',
      bank_code: '30012',
      desk_code: '00585',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010156142',
      next_date: '2023-03-29',
      next_amount: '636338.79',
    },
  ],
  [
    `0712206    04400EUR2 56022698740  190224        ------------------------------            0000000000000{`,
    {
      _1: '',
      _2: '',
      _3: '',
      _4: '------------------------------',
      _5: '',
      record_code: '07',
      bank_code: '12206',
      desk_code: '04400',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '56022698740',
      next_date: '2024-02-19',
      next_amount: '0',
    },
  ],
];

describe('ebics footer parser', function () {
  test.each(cases)('case %#', (text, expected) => {
    expect(parse(text)).toEqual(expected);
  });
});
