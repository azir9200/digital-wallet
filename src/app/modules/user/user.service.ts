import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import mongoose from "mongoose";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email, password, role } = payload;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
  }
  if (!password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const hashedPassword = await bcryptjs.hash(
      password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const newUser = new User({
      name,
      email,
      role,
      password: hashedPassword,
    });

    await newUser.save({ session });

    const newWallet = new Wallet({
      ownerId: newUser._id,
    });

    await newWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      user: newUser,
      wallet: newWallet,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create user and wallet"
    );
  }
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    User.find({ role: "USER" }),
    query || {}
  );
  const userData = queryBuilder
    .search(userSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    userData.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};
const getAllAgents = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    User.find({ role: "AGENT" }),
    query || {}
  );
  const userData = queryBuilder
    .search(userSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    userData.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};

const actionUser = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (payload.role) {
    user.role = payload.role;
  }
  // user.status = payload.status;
  await user.save();

  return user;
};

const agentApproved = async (id: string, payload: Partial<IUser>) => {
  const agent = await User.findOne({ _id: id, role: "AGENT" });

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }
  if (payload.agentStatus) {
    agent.agentStatus = payload.agentStatus;
  }
  // agent.role = payload.role;
  await agent.save();

  return agent;
};
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
    if (userId !== decodedToken.userId) {
      throw new AppError(401, "You are not authorized");
    }
  }

  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (
    decodedToken.role === Role.ADMIN &&
    ifUserExist.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(401, "You are not authorized");
  }
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};
const deleteUser = async (id: string) => {
  await Wallet.findByIdAndDelete(id);
  return null;
};
export const UserServices = {
  createUser,
  getAllUsers,
  getAllAgents,
  getSingleUser,
  actionUser,
  agentApproved,
  updateUser,
  deleteUser,
};
