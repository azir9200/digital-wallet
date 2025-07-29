export enum TransactionType {
  ADD_MONEY = "ADD_MONEY",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REVERSED = "REVERSED",
}

export interface ITransaction {
  from?: string;
  to?: string;
  type: TransactionType;
  amount: number;
  fee?: number;
  commission?: number;
  status: TransactionStatus;
  performedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
