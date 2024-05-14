import { describe, test, expect } from 'vitest';
import parse from './index';

const cases: [string, Record<string, string>][] = [
  [
    `0130012    00071EUR2 00010139479  280323                                                  0000003445691I`,
    {
      record_code: '01',
      bank_code: '30012',
      desk_code: '00071',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010139479',
      prev_date: '2023-03-28',
      prev_amount: '344569.19',
      _1: '',
      _2: '',
      _3: '',
      _4: '',
      _5: '',
    },
  ],
  [
    `0130012    00823EUR2 00010738652  280323                                                  0000000008653O`,
    {
      record_code: '01',
      bank_code: '30012',
      desk_code: '00823',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010738652',
      prev_date: '2023-03-28',
      prev_amount: '-865.36',
      _1: '',
      _2: '',
      _3: '',
      _4: '',
      _5: '',
    },
  ],
  [
    `0130012    00585EUR2 00010156142  280323                                                  0000006564827I`,
    {
      record_code: '01',
      bank_code: '30012',
      desk_code: '00585',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010156142',
      prev_date: '2023-03-28',
      prev_amount: '656482.79',
      _1: '',
      _2: '',
      _3: '',
      _4: '',
      _5: '',
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
      _1: '',
      _2: '',
      _3: '',
      _4: '',
      _5: '',
    },
  ],
  [
    `0130012    00822EUR2 00010898395  160222                                                  0000000566672H                `,
    {
      record_code: '01',
      bank_code: '30012',
      desk_code: '00822',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010898395',
      prev_date: '2022-02-16',
      prev_amount: '56667.28',
      _1: '',
      _2: '',
      _3: '',
      _4: '',
      _5: '',
    },
  ],
  [
    '0110278    06186EUR2 00020828502  030323                                                  0000003522324E030323060323    ',
    {
      record_code: '01',
      bank_code: '10278',
      desk_code: '06186',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00020828502',
      prev_date: '2023-03-03',
      prev_amount: '352232.45',
      _1: '',
      _2: '',
      _3: '',
      _4: '',
      _5: '030323060323',
    },
  ],
  [
    '0118020 00001EUR2 00410GXLT01',
    {
      record_code: '01',
      bank_code: '18020',
      _1: '000',
    },
  ],
];

describe('ebics header parser', function () {
  test.each(cases)('case %#', (text, expected) => {
    expect(parse(text)).toEqual(expected);
  });
});
