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
const getAllTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getAllTransaction();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Transaction  retrieved Successfully !",
    data: result.data,
    meta: result.meta,
  });
});
const getSingleTransaction = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log("object", id);
  const result = await TransactionService.getSingleTransaction(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Transaction  retrieved Successfully !",
    data: result.data,
  });
});

const updateTransaction = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TransactionService.updateTransaction(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Transaction  info id updated",
    data: result,
  });
});

const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.deleteTransaction(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Transaction  is deleted",
    data: result,
  });
});

export const TransactionController = {
  createTransaction,
  getAllTransaction,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
};
