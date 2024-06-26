type CreditLetterKey = keyof typeof creditLettersList;
const creditLettersList = {
  A: '1',
  B: '2',
  C: '3',
  D: '4',
  E: '5',
  F: '6',
  G: '7',
  H: '8',
  I: '9',
  '{': '0',
};

type DebitLetterKey = keyof typeof debitLettersList;
const debitLettersList = {
  J: '1',
  K: '2',
  L: '3',
  M: '4',
  N: '5',
  O: '6',
  P: '7',
  Q: '8',
  R: '9',
  '}': '0',
};

const debitLetters = Object.keys(debitLettersList);

export function getAmount(word: string, nbDecimals: string | number): string {
  let amount;

  const lastKey = word.slice(-1);
  const startIndex = Array.from(word).findIndex((element) => element !== '0');
  let needed = word.slice(startIndex, -1);

  if (!needed.length) {
    needed = '0';
  }

  let sign = '';
  if (debitLetters.includes(lastKey)) {
    amount = `${needed}${debitLettersList[lastKey as DebitLetterKey]}`;
    sign = '-';
  } else {
    amount = `${needed}${creditLettersList[lastKey as CreditLetterKey]}`;
  }

  if (amount.length > +nbDecimals) {
    amount = [amount.slice(0, -nbDecimals), amount.slice(-nbDecimals)].join(
      '.'
    );
  } else {
    amount = [0, amount.slice(-nbDecimals)].join('.');
  }

  // remove last unneeded 0 in decimals
  amount = `${sign}${+amount}`;

  if (amount === '-0') {
    amount = '0';
  }

  return amount;
}
