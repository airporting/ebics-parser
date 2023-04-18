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

const fileContent = `0130004    00071EUR2 00010139479  280323                                                  0000003445691I
0730004    00071EUR2 00010139479  290323                                                  0000003445691I`;

const result = ebicsParser(fileContent);

console.log(result);
```
Result:
```json5
{
  header: {
    record_code: '01',
      bank_code: '30004',
      desk_code: '00071',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010139479',
      prev_date: '2023-03-28',
      prev_amount: '344569.19',
  },
  footer: {
    record_code: '07',
      bank_code: '30004',
      desk_code: '00071',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010139479',
      next_date: '2023-03-29',
      next_amount: '344569.19',
  },
  transactions: [],
}
```
