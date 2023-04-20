[![test](https://github.com/airporting/ebics-parser/actions/workflows/test.yml/badge.svg)](https://github.com/airporting/ebics-parser/actions/workflows/test.yml)

# ebics-parser

Lightweight and very fast parser, only one dep (date-fns).

MIT Licensed

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
    header: {
      record_code: '01',
      bank_code: '30004',
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
        account_nb: '00010156142',
        operation_code: '18',
        operation_date: '2023-03-29',
        reject_code: '',
        value_date: '2023-03-29',
        label: 'DOMUSVI',
        reference: '0000000',
        exempt_code: '',
        amount: '35919',
        debtor_name: 'DOMUSVI',
        remittance_information_1: '/INV/3867 8.2.2023',
        end2end_identification: 'NOTPROVIDED',
        purpose: '',
        PDO: 'FR FRANCE',
        _1: '',
        _2: '',
        _3: '',
        '_4:': '',
      },
    ],
    problems: null,
  },
]
```
