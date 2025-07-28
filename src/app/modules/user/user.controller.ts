import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { Request, Response } from "express";
import httpStatus from "http-status-codes";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Created Successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Users Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
};
