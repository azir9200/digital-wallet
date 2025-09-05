import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";
import { StatsTransactionService } from "./statTransactioService";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getUserStats();
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

export const StatsController = {
    getUserStats,
   getTransactionStats,
};