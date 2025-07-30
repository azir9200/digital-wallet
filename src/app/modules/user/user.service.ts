import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import mongoose from "mongoose";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";

// const createUser = async (payload: Partial<IUser>) => {
//   const { name, email, password } = payload;

//   const isUserExist = await User.findOne({ email });

//   if (isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
//   }
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const hashedPassword = await bcryptjs.hash(
//       password as string,
//       Number(envVars.BCRYPT_SALT_ROUND)
//     );

//     //user create
//     const newUser = await User.create(
//       [
//         {
//           name,
//           email,
//           password: hashedPassword,
//         },
//       ],
//       { session }
//     );
//     await Wallet.create([{ ownerId: newUser[0]._id }], {
//       session,
//     });

//     await session.commitTransaction();
//     session.endSession();
//     return {
//       user: newUser[0],
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.log(error);
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to create user and wallet"
//     );
//   }
// };

const createUser = async (payload: Partial<IUser>) => {
  const { name, email, password, role } = payload;
  console.log("role", role);
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
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
  const queryBuilder = new QueryBuilder(User.find(), query || {});
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

const updateUser = async (userId: string, payload: Partial<IUser>) => {
  const ifUserExists = await User.findById(userId);

  if (!ifUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
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
  getSingleUser,
  updateUser,
  deleteUser,
};
