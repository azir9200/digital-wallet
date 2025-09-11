import { TransactionStatus } from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getTransactionStats = async () => {
  const totalTransactionPromise = Transaction.countDocuments();

  const totalCompleteTransactionPromise = Transaction.countDocuments({
    isComplete: TransactionStatus.COMPLETED,
  });
  const totalPendingTransactionPromise = Transaction.countDocuments({
    isPending: TransactionStatus.PENDING,
  });
  const totalReversedTransactionPromise = Transaction.countDocuments({
    isReversed: TransactionStatus.REVERSED,
  });

  const avgTransactionPromise = Transaction.aggregate([
    //Stage-1 : group the cost from, do sum, and average the sum
    {
      $group: {
        _id: null,
        avgTransactionFrom: { $avg: "$amount" },
      },
    },
  ]);

  const newTransactionInLast7DaysPromise = Transaction.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newTransactionInLast30DaysPromise = Transaction.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const [
    totalTransaction,
    totalCompleteTransaction,
    totalPendingTransaction,
    totalReversedTransaction,
    avgTransaction,
    newTransactionInLast7Days,
    newTransactionInLast30Days,
  ] = await Promise.all([
    totalTransactionPromise,
    totalCompleteTransactionPromise,
    totalPendingTransactionPromise,
    totalReversedTransactionPromise,
    avgTransactionPromise,
    newTransactionInLast7DaysPromise,
    newTransactionInLast30DaysPromise,
  ]);
  return {
    totalTransaction,
    totalCompleteTransaction,
    totalPendingTransaction,
    totalReversedTransaction,
    avgTransaction,
    newTransactionInLast7Days,
    newTransactionInLast30Days,
  };
};

export const StatsTransactionService = {
  getTransactionStats,
};
