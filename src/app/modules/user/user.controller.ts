import { JwtPayload } from "jsonwebtoken";
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
  const query = req.query;
  const result = await UserServices.getAllUsers(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Users Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllAgents = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await UserServices.getAllAgents(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Agents Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserServices.getSingleUser(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Retrieved Successfully",
    data: result.data,
  });
});
const getMe = catchAsync(async (req: Request, res: Response) => {
  const id = req?.user?.id;
  console.log(" id", id);
  console.log(" id", req.user);
  const result = await UserServices.getMe(id);
  console.log("res", result);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Retrieved Successfully",
    data: result,
  });
});
const actionUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const user = await UserServices.actionUser(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Updated Successfully",
    data: user,
  });
});
const agentApproved = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserServices.agentApproved(req.params.id, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Wallet is deleted",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const verifiedToken = req.user;

  const payload = req.body;
  const user = await UserServices.updateUser(
    userId,
    payload,
    verifiedToken as JwtPayload
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Updated Successfully",
    data: user,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.deleteUser(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Wallet is deleted",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  getMe,
  actionUser,
  agentApproved,
  getAllAgents,
  updateUser,
  deleteUser,
};
