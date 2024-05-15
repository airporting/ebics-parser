import transactionHeaderParser, {
  ParsedTransactionHeader,
} from '@/src/transactionHeader';
import transactionBodyParser from '@/src/transactionBody';
import headerParser from '@/src/header';
import footerParser from '@/src/footer';
import schema from './schema';
import { ParsedTransactionFields, TransactionFields } from '@/src/transaction';

export default function chunkParser(allLines: string[]) {
  let header: ParsedTransactionFields = {};
  let footer: ParsedTransactionFields = {};
  const transactionsList: ParsedTransactionFields[] = [];
  let currentTransaction: ParsedTransactionHeader | null = null;
  let currentLabelIncrement = 0;
  const problems: {
    message: string;
    line?: string;
    details?: { message: string; line?: string }[];
  }[] = [];
  let startAmount: string | undefined;
  let endAmount: string | undefined;
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

        const filledTransactionFields: Record<string, string | undefined> = {};
        Object.entries(transaction)
          .filter(([key, value]) => {
            return (
              value !== '' ||
              !currentTransaction?.transaction[key as keyof TransactionFields]
            );
          })
          .forEach(([key, value]) => {
            filledTransactionFields[key] = value;
          });

        currentTransaction = {
          transaction: {
            ...currentTransaction?.transaction,
            ...filledTransactionFields,
            record_code: '04',
          },
          problems: currentTransaction?.problems.slice(0) || [],
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
        message: (err as string).toString(),
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
  const transactionsSum = Math.abs(
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

  const parseFloatOr = <T>(value: string | undefined, or: T) => {
    if (!value) return or;
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
      details: [{ message: isAccountValid.error?.message }],
    });
  }

  return account;
}
