/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from "http-status-codes";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { Wallet } from "../wallet/wallet.model";
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";

const createTransfer = async (payload: Partial<ITransaction>) => {
  const { sender, receiver, amount } = payload;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find sender and receiver wallets
    const senderWallet = await Wallet.findOne({ ownerId: sender }).session(
      session
    );
    const receiverWallet = await Wallet.findOne({ ownerId: receiver }).session(
      session
    );

    if (!senderWallet || !receiverWallet) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Sender or receiver wallet not found"
      );
    }

    if (senderWallet.balance! < amount!) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    // Update balances
    senderWallet!.balance! -= amount!;
    receiverWallet!.balance! += amount!;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    // Create transaction
    const transaction = await Transaction.create(
      [
        {
          sender,
          receiver,
          amount,
          status: "COMPLETED",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const addMoney = async (userId: string, payload: Partial<ITransaction>) => {
  const { amount } = payload;
  const amountNumber = Number(amount);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingWallet = await Wallet.findOne({ ownerId: userId }).session(
      session
    );

    if (!existingWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    existingWallet!.balance! += amountNumber!;
    await existingWallet.save({ session });

    // Create transaction
    const transaction = await Transaction.create(
      [
        {
          userId,
          type: "ADD_MONEY",
          amount,
          status: "COMPLETED",
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const withdrawMoney = async (
  userId: string,
  payload: Partial<ITransaction>
) => {
  const { amount } = payload;
  const amountNumber = Number(amount);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingWallet = await Wallet.findOne({ ownerId: userId }).session(
      session
    );

    if (!existingWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    existingWallet!.balance! -= amountNumber!;
    await existingWallet.save({ session });

    // Create transaction
    const transaction = await Transaction.create(
      [
        {
          userId,
          type: "WITHDRAW",
          amount,
          status: "COMPLETED",
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllTransaction = async () => {
  const result = await Transaction.find({});
  const totalTransaction = await Transaction.countDocuments();
  return {
    data: result,
    meta: {
      total: totalTransaction,
    },
  };
};
const getSingleTransaction = async (id: string) => {
  const result = await Transaction.findById({ _id: id });
  return {
    data: result,
  };
};
const updateTransaction = async (
  id: string,
  payload: Partial<ITransaction>
) => {
  const existingWallet = await Transaction.findById(id);
  if (!existingWallet) {
    throw new Error("Transaction not found.");
  }
  const updatedTransaction = await Transaction.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedTransaction;
};
const deleteTransaction = async (id: string) => {
  await Transaction.findByIdAndDelete(id);
  return null;
};

export const TransactionService = {
  createTransfer,
  addMoney,
  withdrawMoney,
  getAllTransaction,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
};
