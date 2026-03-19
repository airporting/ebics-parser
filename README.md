[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Static Badge](https://img.shields.io/badge/coverage-91.34-brightgreen)
![Static Badge](https://img.shields.io/badge/release-3.3.0-blue)
[![test](https://github.com/airporting/ebics-parser/actions/workflows/test.yml/badge.svg)](https://github.com/airporting/ebics-parser/actions/workflows/test.yml)

# ebics-parser

Lightweight and very fast parser for EBICS files for Node.js & TypeScript.
Only two deps (date-fns, zod).

Used by [Airporting](https://www.airporting.com)

Tested from NodeJS 18.x to 24.x

[![Linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/airporting)

## Setup

```bash
# Install
yarn add @airporting/ebics-parser

# Or with npm
npm install @airporting/ebics-parser
```

Requires Node.js 18+.

## Usage

### As a library

```javascript
import ebicsParser from '@airporting/ebics-parser';

const fileContent = `0130012    00585EUR2 00010156142  280323                                                  0000006564827I
0430012056800585EUR2 0001015614218290323  290323DOMUSVI                          0000000  0000000359190{
0530012056800585EUR2 0001015614218290323     NPYDOMUSVI
0530012056800585EUR2 0001015614218290323     LCC/INV/3867 8.2.2023
0530012056800585EUR2 0001015614218290323     RCNNOTPROVIDED
0530012056800585EUR2 0001015614218290323     PDOFR FRANCE
0730012    00585EUR2 00010156142  290323                                                  0000006363387I`;

const result = ebicsParser(fileContent);

console.log(result);
```

### CLI tool

```bash
yarn parse <filepath>
```

Reads an EBICS file, parses it, and writes the result as JSON to `<filename>.parsed.json` in the same directory.

### Result structure

```json5
[
  {
    details: {
      countTransactions: 1,
    },
    amounts: {
      start: 656482.79,   // opening balance
      end: 636338.79,     // closing balance
      diff: 20144,        // |start - end|
      transactions: 35919, // sum of transaction amounts
    },
    header: {
      record_code: '01',
      bank_code: '30012',
      desk_code: '00585',
      currency_code: 'EUR',
      nb_of_dec: '2',
      account_nb: '00010156142',
      prev_date: '2023-03-28',
      prev_amount: '656482.79',
      // _1.._5: padding fields
    },
    footer: {
      record_code: '07',
      bank_code: '30012',
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
        bank_code: '30012',
        internal_code: '0568',
        desk_code: '00585',
        currency_code: 'EUR',
        nb_of_dec: '2',
        account_nb: '00010156142',
        operation_code: '18',
        operation_date: '2023-03-29',
        value_date: '2023-03-29',
        label: 'DOMUSVI',
        amount: '35919',
        debtor_name: 'DOMUSVI',
        remittance_information_1: '/INV/3867 8.2.2023',
        end2end_identification: 'NOTPROVIDED',
        PDO: 'FR FRANCE',
        _rank: '0',  // position in transaction list (not an official field)
      },
    ],
    // problems detected during parse, null if none
    problems: [
      {
        message: "Sum of transactions (35919) doesn't match with difference between start amount 656482.79 and end amount 636338.79",
      },
    ],
  },
]
```

## Architecture

```
src/
├── index.ts                    # Entry point: split lines, demultiplex, chunk by account
├── cli.ts                      # CLI tool (yarn parse)
├── account/
│   ├── index.ts                # Per-account parser: orchestrates header/footer/transactions
│   └── schema.ts               # Zod validation schema for parsed accounts
├── header/index.ts             # Record 01 parser (opening balance)
├── footer/index.ts             # Record 07 parser (closing balance)
├── transactionHeader/index.ts  # Record 04/03 parser (transaction main line)
├── transactionBody/
│   ├── index.ts                # Record 05 parser (transaction detail line)
│   └── qualifier/index.ts      # SEPA qualifier resolver (CBE, IBE, NBE, etc.)
├── transaction/index.ts        # Shared types (TransactionFields, QualifierType)
├── amount/index.ts             # EBICS amount decoding (letter → digit + sign)
└── shared/
    └── parseLineWithParts.ts   # Generic regex-based line parser (shared by all record parsers)
```

### Parsing flow

1. **Split & clean** — Input text is split into lines, empty lines removed
2. **Demultiplex** — If all lines start with `01`, detect concatenated records and split them
3. **Chunk** — Group lines by account (each `01` line starts a new account)
4. **Parse account** — For each chunk:
   - `01` → `headerParser` (opening balance)
   - `04`/`03` → `transactionHeaderParser` (transaction)
   - `05` → `transactionBodyParser` → `qualifierResolver` (SEPA details)
   - `07` → `footerParser` (closing balance)
5. **Validate** — Zod schema validation, amount consistency check

### EBICS line record codes

| Code | Description |
|------|---|
| 01 | Account header (opening balance) |
| 03 | Transaction (variant of 04, treated as 04) |
| 04 | Transaction main line |
| 05 | Transaction detail (qualifier-based SEPA fields) |
| 07 | Account footer (closing balance) |

## External docs to understand the EBICS standard

https://www.ca-centreloire.fr/Vitrine/ObjCommun/Fic/CentreLoire/Entreprise/GuideParamRel_EDI.pdf

With more details on qualifier "05" (additional details on transaction, qualifier "04")
https://www.promosoft.fr/wp-content/uploads/2013/06/Livre_blanc_SEPA.pdf

## Opinions, known bugs & pitfalls

### Opinions

We took some decisions about what is allowed or not in an EBICS parse result. We still don't have found a complete and exhaustive docs about this format. So
everything is based on our guesses. See section "[Whatever](#whatever)".

In transactions items, fields `internal_code` and `operation_code` need at least one of them to be filled.

### Line record code

Most lines start with code `01` (start balance), `07` (end balance), `04` (main transaction line) and `05` (transaction detail line). But we already met lines
with record code `03`. We have guess that it's a very similar usage of record code `04`, so for the moment, when met, transformed in `04`.

### Transactions \_rank

For each transaction in an account, we have added a field `_rank`. It helps to know at which position in the account it was positionned.

### Details

For each account, we provide a set of data which is guessed by our parser. It's NOT provided by the original file. See the example above to know the exact usage.

### Whatever

- We try to manage when carriage return is not present in the raw text file, we didn't found any bug yet but you probably will. We do the best we can.
- If you find a bug, don't hesitate to open an issue or a pull request.
- If you have a doc with complete specs, we'll thanks you a lot.

## Thanks

Made by [Airporting](https://www.airporting.com) people with 🧡.
