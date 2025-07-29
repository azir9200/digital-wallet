import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { WalletService } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";

const createWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletService.createWallet(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Your Wallet created successfully",
    data: result,
  });
});

const getAllWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletService.getAllWallet();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All  Wallet retrieved Successfully !",
    data: result.data,
    meta: result.meta,
  });
});
const getSingleWallet = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log("object", id);
  const result = await WalletService.getSingleWallet(id);
  console.log(" ssdd", result);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Wallet retrieved Successfully !",
    data: result.data,
  });
});

const updateWallet = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await WalletService.updateWallet(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your wallet info id updated",
    data: result,
  });
});

const deleteWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletService.deleteWallet(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Wallet is deleted",
    data: result,
  });
});

export const WalletController = {
  createWallet,
  getAllWallet,
  getSingleWallet,
  updateWallet,
  deleteWallet,
};
