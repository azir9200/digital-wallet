import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}
export interface IWallet {
  _id?: Types.ObjectId;
  ownerId: Types.ObjectId; // Reference to User
  balance: number;
  status: WalletStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
