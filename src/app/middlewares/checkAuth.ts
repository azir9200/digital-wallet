import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { Status } from "../modules/user/user.interface";
import { CustomJwtPayload } from "../type/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req?.headers?.authorization || req?.cookies?.accessToken;

      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as CustomJwtPayload;

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      //Blocked user
      if (isUserExist.status === Status.BLOCKED) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.status}`
        );
      }

      // Deleted user
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      if (
        isUserExist.role === "AGENT" &&
        isUserExist.agentStatus !== "approved"
      ) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          `Agent is ${isUserExist.status}. Please wait for admin approval.`
        );
      }
      // Role check
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!!!");
      }

      req.user = verifiedToken as JwtPayload & { role: string };
      req.tokenPayload = verifiedToken;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
