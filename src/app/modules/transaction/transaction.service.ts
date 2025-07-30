import status from "http-status-codes";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { Wallet } from "../wallet/wallet.model";
import { Types } from "mongoose";

interface CreateTransactionPayload {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  amount: number;
}

const createTransaction = async (payload: CreateTransactionPayload) => {
  const { sender, receiver, amount } = payload;

  const senderWallet = await Wallet.findOne({ user: sender });
  const receiverWallet = await Wallet.findOne({ user: receiver });

  if (!senderWallet || !receiverWallet) {
    throw new Error("Sender or receiver wallet not found");
  }

  if (senderWallet?.balance < amount) {
    throw new Error("Insufficient balance");
  }

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  await senderWallet.save();
  await receiverWallet.save();

  // Create transaction record
  const transaction = await Transaction.create({
    sender,
    receiver,
    amount,
    type: TransactionType.SEND,
    status: TransactionStatus.COMPLETED,
  });

  return transaction;
};

export const TransactionService = {
  createTransaction,
};
