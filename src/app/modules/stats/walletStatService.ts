/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountType, WalletStatus } from "../wallet/wallet.interface";
import { Wallet } from "../wallet/wallet.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getWalletStats = async () => {
  const totalWalletPromise = Wallet.countDocuments();

  const totalWalletByStatusPromise = Wallet.aggregate([
    //stage-1 group stage
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]).then((res) => {
    const statusCounts: Record<WalletStatus, number> = {
      [WalletStatus.ACTIVE]: 0,
      [WalletStatus.BLOCKED]: 0,
    };
    res.forEach((item) => {
      statusCounts[item._id as WalletStatus] = item.count;
    });
    return statusCounts;
  });
  const totalWalletByAccountTypePromise = Wallet.aggregate([
    //stage-1 group stage
    {
      $group: {
        _id: "$accountType",
        count: { $sum: 1 },
      },
    },
  ]).then((res) => {
    const accountTypeCounts: Record<AccountType, number> = {
      [AccountType.PERSONAL]: 0,
      [AccountType.BUSINESS]: 0,
    };
    res.forEach((item) => {
      accountTypeCounts[item._id as AccountType] = item.count;
    });
    return accountTypeCounts;
  });
  const walletLast7DaysPromise = Wallet.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const walletLast30DaysPromise = Wallet.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });
  const totalWalletByUniqueUsersPromise = Wallet.distinct("user").then(
    (user: any) => user.length
  );

  const [
    totalWallet,
    totalWalletByStatus,
    totalWalletByAccountType,
    walletLast7Days,
    walletLast30Days,
    totalWalletByUniqueUsers,
  ] = await Promise.all([
    totalWalletPromise,
    totalWalletByStatusPromise,
    totalWalletByAccountTypePromise,
    walletLast7DaysPromise,
    walletLast30DaysPromise,
    totalWalletByUniqueUsersPromise,
  ]);
  return {
    totalWallet,
    totalWalletByStatus,
    totalWalletByAccountType,
    walletLast7Days,
    walletLast30Days,
    totalWalletByUniqueUsers,
  };
};

export const WalletStatService = {
  getWalletStats,
};
