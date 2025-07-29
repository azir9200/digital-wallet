import { model, Schema } from "mongoose";
import { ITransaction, TransactionStatus } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    from: { type: String },
    to: { type: String },
    type: { type: String },
    amount: { type: Number },
    fee: { type: Number },
    commission: { type: Number },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
