import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TransactionService } from "./transaction.service";

const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.createTransaction(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Your transaction made successfully",
    data: result,
  });
});

export const transactionController = {
  createTransaction,
};
