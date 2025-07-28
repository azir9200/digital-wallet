import { model, Schema } from "mongoose";
import { IWallet, WalletStatus } from "./wallet.interface";

const WalletSchema = new Schema<IWallet>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 50 },
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

export const Tour = model<IWallet>("Wallet", WalletSchema);
