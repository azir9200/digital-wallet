import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";

const authLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.authLogin(req.body);
  // console.log("login info", loginInfo);
  setAuthCookie(res, loginInfo);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged In Successfully",
    data: loginInfo,
  });
});
export const AuthControllers = {
  authLogin,
};
