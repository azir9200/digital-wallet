import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}
export interface IWallet {
  id?: Types.ObjectId;
  ownerId: Types.ObjectId; // User
  balance?: number;
  status?: WalletStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
