[![test](https://github.com/airporting/ebics-parser/actions/workflows/test.yml/badge.svg)](https://github.com/airporting/ebics-parser/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


# ebics-parser

Lightweight and very fast parser, only two dep (date-fns, joi).

* Coverage : **_88.8%_**
* Used by [Airporting](https://www.airporting.com)

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
    "amounts": {
      "start": 656482.79, // account start balance
      "end": 636338.79, // account end balance
      "diff": 20144, // difference between start and end
      "transactions": 35919 // sum of transactions amount
    },
    "header": {
      "record_code": "01",
      "bank_code": "30004",
      "_1": "",
      "desk_code": "00585",
      "currency_code": "EUR",
      "nb_of_dec": "2",
      "_2": "",
      "account_nb": "00010156142",
      "_3": "",
      "prev_date": "2023-03-28",
      "_4": "",
      "prev_amount": "656482.79",
      "_5": ""
    },
    "footer": {
      "record_code": "07",
      "bank_code": "30004",
      "desk_code": "00585",
      "currency_code": "EUR",
      "nb_of_dec": "2",
      "account_nb": "00010156142",
      "next_date": "2023-03-29",
      "next_amount": "636338.79"
    },
    "transactions": [
      {
        "record_code": "04",
        "bank_code": "30004",
        "internal_code": "0568",
        "desk_code": "00585",
        "currency_code": "EUR",
        "nb_of_dec": "2",
        "_1": "",
        "account_nb": "00010156142",
        "operation_code": "18",
        "operation_date": "2023-03-29",
        "reject_code": "",
        "value_date": "2023-03-29",
        "label": "DOMUSVI",
        "_2": "",
        "reference": "0000000",
        "exempt_code": "",
        "_3": "",
        "amount": "35919",
        "_4:": "",
        "debtor_name": "DOMUSVI",
        "remittance_information_1": "/INV/3867 8.2.2023",
        "end2end_identification": "NOTPROVIDED",
        "purpose": "",
        "PDO": "FR FRANCE"
      }
    ],
    // problems detected during parse. If no problems, null
    "problems": [
      {
        "message": "Sum of transactions (35919) doesn't match with difference between start amount 656482.79 and end amount 636338.79"
      }
    ]
  }
]
```

## Known bugs & pitfalls

### Qualifiers

We were not able to find a complete specification about this format, so we don't know how to match some transaction qualifiers, like:
- PDO
- NOM
- CPY

### Line record code

Most lines start with code `01` (start balance), `07` (end balance), `04` (main transaction line) and `05` (transaction detail line). But we already met line with record code `03`. We have guess that it's a very similar usage of record code `03`, so for the moment, when met, transformed in `04`.

### Whatever

- If you find a bug, don't hesitate to open an issue or a pull request.
- If you have a doc with complete specs, we'll thanks you a lot.

## Thanks

Made by [Airporting](https://www.airporting.com) people with love.

