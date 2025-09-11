import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsTransactionService } from "./statTransactionService";
import { UserStatsService } from "./userSTats.service";
import { WalletStatService } from "./walletStatService";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await UserStatsService.getUserStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User stats fetched successfully",
    data: stats,
  });
});

const getTransactionStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsTransactionService.getTransactionStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Transaction stats fetched successfully",
    data: stats,
  });
});
const getWalletStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await WalletStatService.getWalletStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Wallet stats fetched successfully",
    data: stats,
  });
});

export const StatsController = {
  getUserStats,
  getTransactionStats,
  getWalletStats,
};
