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
exports.StatsTransactionService = void 0;
const transaction_interface_1 = require("../transaction/transaction.interface");
const transaction_model_1 = require("../transaction/transaction.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getTransactionStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTransactionPromise = transaction_model_1.Transaction.countDocuments();
    const totalCompleteTransactionPromise = transaction_model_1.Transaction.countDocuments({
        isComplete: transaction_interface_1.TransactionStatus.COMPLETED,
    });
    const totalPendingTransactionPromise = transaction_model_1.Transaction.countDocuments({
        isPending: transaction_interface_1.TransactionStatus.PENDING,
    });
    const totalReversedTransactionPromise = transaction_model_1.Transaction.countDocuments({
        isReversed: transaction_interface_1.TransactionStatus.REVERSED,
    });
    const avgTransactionPromise = transaction_model_1.Transaction.aggregate([
        //Stage-1 : group the cost from, do sum, and average the sum
        {
            $group: {
                _id: null,
                avgTransactionFrom: { $avg: "$amount" },
            },
        },
    ]);
    const newTransactionInLast7DaysPromise = transaction_model_1.Transaction.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newTransactionInLast30DaysPromise = transaction_model_1.Transaction.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const [totalTransaction, totalCompleteTransaction, totalPendingTransaction, totalReversedTransaction, avgTransaction, newTransactionInLast7Days, newTransactionInLast30Days,] = yield Promise.all([
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
});
exports.StatsTransactionService = {
    getTransactionStats,
};
