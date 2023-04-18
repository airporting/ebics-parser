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

const fileContent = `0118020    00001EUR2 00410GXLT11  050423                                                  0000024431270M                
  0418020505100001EUR2 00410GXLT1105060423  310323VIREMENT RECU  FACTURE N 806500  3142953 00000000006000{000005          
  0518020505100001EUR2 00410GXLT1105060423  31032341 LEROY MERLIN FRANCE                                                  
  0718020    00001EUR2 00410GXLT11  060423                                                  0000024365270M                `;

const result = ebicsParser(fileContent);

console.log(result);
```
Result:
```json5
[
  {
    header: {
      record_code: '01',
      bank_code: '18020',
      desk_code: '00001',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00410GXLT11',
      prev_date: '2023-04-05',
      prev_amount: '-2443127.04',
    },
    footer: {
      record_code: '07',
      bank_code: '18020',
      desk_code: '00001',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00410GXLT11',
      next_date: '2023-04-06',
      next_amount: '-2436527.04',
    },
    transactions: [
      {
        323: '41 LEROY MERLIN FRANCE',
        record_code: '04',
        bank_code: '18020',
        internal_code: '5051',
        desk_code: '00001',
        currency_code: 'EUR',
        nb_of_dec: '2',
        _1: '',
        account_nb: '00410GXLT11',
        operation_code: '05',
        operation_date: '2023-04-06',
        reject_code: '',
        value_date: '2023-03-31',
        label: 'VIREMENT RECU  FACTURE N 806500',
        _2: '310',
        reference: '3142953',
        exempt_code: '',
        _3: '0',
        amount: '600',
        '_4:': '000005',
      },
    ],
    problems: null,
  }
]
```
