"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("./user.model");
const env_1 = require("../../config/env");
const wallet_model_1 = require("../wallet/wallet.model");
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_constant_1 = require("./user.constant");
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
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exists");
    }
    if (!password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Password is required");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const newUser = new user_model_1.User({
            name,
            email,
            role,
            password: hashedPassword,
        });
        yield newUser.save({ session });
        const newWallet = new wallet_model_1.Wallet({
            ownerId: newUser._id,
        });
        yield newWallet.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return {
            user: newUser,
            wallet: newWallet,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error(error);
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to create user and wallet");
    }
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query || {});
    const userData = queryBuilder
        .search(user_constant_1.userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        userData.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    return {
        data: user,
    };
});
const updateUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExists = yield user_model_1.User.findById(userId);
    if (!ifUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, env_1.envVars.BCRYPT_SALT_ROUND);
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield wallet_model_1.Wallet.findByIdAndDelete(id);
    return null;
});
exports.UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
