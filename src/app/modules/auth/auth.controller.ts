import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import AppError from "../../errorHelpers/AppError";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";

const authLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.authLogin(req.body);
  console.log("login info", loginInfo);
  setAuthCookie(res, loginInfo);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged In Successfully",
    data: loginInfo,
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No refresh token received from cookies"
    );
  }
  const tokenInfo = await AuthServices.getNewAccessToken(
    refreshToken as string
  );
  // console.log("object token info", tokenInfo);

  setAuthCookie(res, tokenInfo);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "New Access Token Retrieved Successfully",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged Out Successfully",
    data: null,
  });
});

const googleCallbackController = catchAsync(
  async (req: Request, res: Response) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    console.log("authCont", user);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    const tokenInfo = createUserTokens(user);
    console.log("auth cont", tokenInfo);
    setAuthCookie(res, tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  authLogin,
  getNewAccessToken,
  logout,
  googleCallbackController,
};
