"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletStatService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const wallet_interface_1 = require("../wallet/wallet.interface");
const wallet_model_1 = require("../wallet/wallet.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getWalletStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalWalletPromise = wallet_model_1.Wallet.countDocuments();
    const totalWalletByStatusPromise = wallet_model_1.Wallet.aggregate([
        //stage-1 group stage
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]).then((res) => {
        const statusCounts = {
            [wallet_interface_1.WalletStatus.ACTIVE]: 0,
            [wallet_interface_1.WalletStatus.BLOCKED]: 0,
        };
        res.forEach((item) => {
            statusCounts[item._id] = item.count;
        });
        return statusCounts;
    });
    const totalWalletByAccountTypePromise = wallet_model_1.Wallet.aggregate([
        //stage-1 group stage
        {
            $group: {
                _id: "$accountType",
                count: { $sum: 1 },
            },
        },
    ]).then((res) => {
        const accountTypeCounts = {
            [wallet_interface_1.AccountType.PERSONAL]: 0,
            [wallet_interface_1.AccountType.BUSINESS]: 0,
        };
        res.forEach((item) => {
            accountTypeCounts[item._id] = item.count;
        });
        return accountTypeCounts;
    });
    const walletLast7DaysPromise = wallet_model_1.Wallet.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const walletLast30DaysPromise = wallet_model_1.Wallet.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const totalWalletByUniqueUsersPromise = wallet_model_1.Wallet.distinct("user").then((user) => user.length);
    const [totalWallet, totalWalletByStatus, totalWalletByAccountType, walletLast7Days, walletLast30Days, totalWalletByUniqueUsers,] = yield Promise.all([
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
});
exports.WalletStatService = {
    getWalletStats,
};
