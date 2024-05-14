import transactionHeaderParser, {
  ParsedTransactionHeader,
} from '../transactionHeader';
import transactionBodyParser from '../transactionBody';
import headerParser from '../header';
import footerParser from '../footer';
import schema from './schema';
import { ParsedTransactionFields } from '../transaction';

export default function chunkParser(allLines: string[]) {
  let header: ParsedTransactionFields = {};
  let footer: ParsedTransactionFields = {};
  const transactionsList: ParsedTransactionFields[] = [];
  let currentTransaction: ParsedTransactionHeader = null;
  let currentLabelIncrement = 0;
  const problems: {
    message: string;
    line?: string;
    details?: any;
  }[] = [];
  let startAmount: string;
  let endAmount: string;
  const transactionsAmounts: string[] = [];

  allLines.forEach((line) => {
    if (!line.length) {
      return;
    }

    try {
      const lineQualifier = line.slice(0, 2);

      if (lineQualifier === '04' || lineQualifier === '03') {
        if (currentTransaction) {
          currentLabelIncrement = 0;
          if (currentTransaction.problems?.length) {
            problems.push({
              message: `Transaction #${transactionsList.length} has problem(s)`,
              line,
              details: currentTransaction.problems,
            });
          }
          transactionsList.push(currentTransaction.transaction);
        }
        currentTransaction = transactionHeaderParser(line);

        if (currentTransaction.transaction.record_code === '03') {
          currentTransaction.problems.push({
            message: 'Wrong line qualifier',
            line,
          });
        }

        if (currentTransaction.transaction.amount) {
          transactionsAmounts.push(currentTransaction.transaction.amount);
        }

        return;
      }

      if (lineQualifier === '05') {
        const transaction = transactionBodyParser(line);

        if (currentTransaction?.transaction?.label && transaction?.label) {
          currentLabelIncrement += 1;
          transaction[`label_${currentLabelIncrement}`] = transaction.label;
          delete transaction.label;
        }

        const filledTransactionFields = {};
        Object.entries(transaction)
          .filter(([key, value]) => {
            return value !== '' || !currentTransaction.transaction[key];
          })
          .forEach(([key, value]) => {
            filledTransactionFields[key] = value;
          });

        currentTransaction = {
          transaction: {
            ...currentTransaction.transaction,
            ...filledTransactionFields,
            record_code: '04',
          },
          problems: [...currentTransaction.problems],
        };

        return;
      }

      if (lineQualifier === '01') {
        header = headerParser(line);

        startAmount = header.prev_amount;

        return;
      }

      if (lineQualifier === '07') {
        if (currentTransaction) {
          currentLabelIncrement = 0;
          if (currentTransaction.problems?.length) {
            problems.push({
              message: `Transaction #${transactionsList.length} has problem(s)`,
              line,
              details: currentTransaction.problems,
            });
          }
          transactionsList.push(currentTransaction.transaction);
        }

        footer = footerParser(line);

        endAmount = footer.next_amount;

        return;
      }

      problems.push({
        message: 'Wrong line qualifier',
        line,
      });
    } catch (err) {
      problems.push({
        message: err,
        line,
      });
    }
  });

  const allTransactionsAmountsSum = transactionsAmounts.reduce(
    (currentSum, currentAmount) => {
      return currentSum + +currentAmount;
    },
    0
  );

  if (!startAmount) {
    problems.push({
      message: 'No start amount',
    });
  }
  if (!endAmount) {
    problems.push({
      message: 'No end amount',
    });
  }

  let diff;
  let transactionsSum = Math.abs(
    Math.round(allTransactionsAmountsSum * 100) / 100
  );
  if (startAmount && endAmount) {
    diff = Math.abs(
      Math.round((parseFloat(startAmount) - parseFloat(endAmount)) * 100) / 100
    );

    if (diff !== transactionsSum) {
      problems.push({
        message: `Sum of transactions (${Math.abs(
          allTransactionsAmountsSum
        )}) doesn't match with difference between start amount ${startAmount} and end amount ${endAmount}`,
      });
    }
  }

  const parseFloatOr = <T>(value: string, or: T) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? or : parsed;
  };

  const account = {
    amounts: {
      start: parseFloatOr(startAmount, undefined),
      end: parseFloatOr(endAmount, undefined),
      diff: parseFloatOr(diff?.toString(), undefined),
      transactions: transactionsSum,
    },
    header,
    footer,
    transactions: transactionsList,
    problems: problems.length ? problems : null,
  };

  const isAccountValid = schema().validate(account);

  if (isAccountValid.error) {
    if (!account.problems) {
      account.problems = [];
    }

    account.problems.push({
      message: 'Malformed account',
      details: isAccountValid.error?.message,
    });
  }

  return account;
}
