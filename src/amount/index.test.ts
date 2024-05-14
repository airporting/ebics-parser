import { describe, test, expect } from 'vitest';
import parse from './index';

const cases: [string, string, number][] = [
  ['0000006564827I', '656482.79', 2],
  ['0000000008653O', '-865.36', 2],
  ['0000003445691I', '344569.19', 2],
  ['0001234{', '123.4', 2],
  ['0000004843H', '484.38', 2],
  ['000000920}', '-92', 2],
  ['000117O', '-1.176', 3],
  ['0000000000000{', '0', 2],
  ['0000000000000}', '0', 2],
  ['0000000000000}', '0', 3],
  ['0000000000000R', '-0.09', 2],
];

describe('ebics amount parser', function () {
  test.each(cases)('case %s to %s (%s decimals)', (text, expected, nbDec) => {
    expect(parse(text, nbDec)).toEqual(expected);
  });
});
