import { model, Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", default: null },
    receiver: { type: Schema.Types.ObjectId, ref: "User", default: null },
    type: { type: String, enum: Object.values(TransactionType) },
   amount: { type: Number, required: true, min: 1 },
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
export const Transaction = model<ITransaction>("Transaction", transactionSchema);