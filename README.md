[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Static Badge](https://img.shields.io/badge/coverage-82.56-brightgreen)
![Static Badge](https://img.shields.io/badge/release-1.13.9-blue)
[![test](https://github.com/airporting/ebics-parser/actions/workflows/test.yml/badge.svg)](https://github.com/airporting/ebics-parser/actions/workflows/test.yml)

# ebics-parser

Lightweight and very fast parser, only two dep (date-fns, joi).

Used by [Airporting](https://www.airporting.com)

Tested on NodeJS 18.x and 20.x

[![Linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/airporting)

## External docs to understand the EBICS standard

https://www.ca-centreloire.fr/Vitrine/ObjCommun/Fic/CentreLoire/Entreprise/GuideParamRel_EDI.pdf

With more details on qualifier "05" (additional details on transaction, qualifier "04")
https://www.promosoft.fr/wp-content/uploads/2013/06/Livre_blanc_SEPA.pdf

## Usage

```javascript
const ebicsParser = require('@airporting/ebics-parser');

const fileContent = `0130004    00585EUR2 00010156142  280323                                                  0000006564827I
0430004056800585EUR2 0001015614218290323  290323DOMUSVI                          0000000  0000000359190{
0530004056800585EUR2 0001015614218290323     NPYDOMUSVI
0530004056800585EUR2 0001015614218290323     LCC/INV/3867 8.2.2023
0530004056800585EUR2 0001015614218290323     RCNNOTPROVIDED
0530004056800585EUR2 0001015614218290323     PDOFR FRANCE
0730004    00585EUR2 00010156142  290323                                                  0000006363387I`;

const result = ebicsParser(fileContent);

console.log(result);
```

Result:

```json5
[
  {
    amounts: {
      start: 656482.79,
      // account start balance
      end: 636338.79,
      // account end balance
      diff: 20144,
      // difference between start and end
      transactions: 35919,
      // sum of transactions amount
    },
    header: {
      record_code: '01',
      bank_code: '30004',
      _1: '',
      desk_code: '00585',
      currency_code: 'EUR',
      nb_of_dec: '2',
      _2: '',
      account_nb: '00010156142',
      _3: '',
      prev_date: '2023-03-28',
      _4: '',
      prev_amount: '656482.79',
      _5: '',
    },
    footer: {
      record_code: '07',
      bank_code: '30004',
      desk_code: '00585',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010156142',
      next_date: '2023-03-29',
      next_amount: '636338.79',
    },
    transactions: [
      {
        record_code: '04',
        bank_code: '30004',
        internal_code: '0568',
        desk_code: '00585',
        currency_code: 'EUR',
        nb_of_dec: '2',
        _1: '',
        account_nb: '00010156142',
        operation_code: '18',
        operation_date: '2023-03-29',
        reject_code: '',
        value_date: '2023-03-29',
        label: 'DOMUSVI',
        _2: '',
        reference: '0000000',
        exempt_code: '',
        _3: '',
        amount: '35919',
        '_4:': '',
        debtor_name: 'DOMUSVI',
        remittance_information_1: '/INV/3867 8.2.2023',
        end2end_identification: 'NOTPROVIDED',
        purpose: '',
        PDO: 'FR FRANCE',
      },
    ],
    // problems detected during parse. If no problems, null
    problems: [
      {
        message: "Sum of transactions (35919) doesn't match with difference between start amount 656482.79 and end amount 636338.79",
      },
    ],
  },
]
```

## Opinions, known bugs & pitfalls

### Opinions

We took some decisions about what is allowed or not in an EBICS parse result. We still don't have found a complete and exhaustive docs about this format. So
everything is based on our guesses. See section "[Whatever](#whatever)".

In transactions items, fields `internal_code` and `operation_code` need at least one of them to be filled.

### Line record code

Most lines start with code `01` (start balance), `07` (end balance), `04` (main transaction line) and `05` (transaction detail line). But we already met lines
with record code `03`. We have guess that it's a very similar usage of record code `04`, so for the moment, when met, transformed in `04`.

### Whatever

- We try to manage when carriage return is not present in the raw text file, we didn't found any bug yet but you probably will. We do the best we can.
- If you find a bug, don't hesitate to open an issue or a pull request.
- If you have a doc with complete specs, we'll thanks you a lot.

## Thanks

Made by [Airporting](https://www.airporting.com) people with 🧡.
