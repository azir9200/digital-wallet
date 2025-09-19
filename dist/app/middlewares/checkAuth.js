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
exports.checkAuth = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jwt_1 = require("../utils/jwt");
const user_interface_1 = require("../modules/user/user.interface");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const accessToken = ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) || ((_b = req === null || req === void 0 ? void 0 : req.cookies) === null || _b === void 0 ? void 0 : _b.accessToken);
        if (!accessToken) {
            throw new AppError_1.default(403, "No Token Received");
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        const isUserExist = yield user_model_1.User.findOne({ email: verifiedToken.email });
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
        }
        //Blocked user
        if (isUserExist.status === user_interface_1.Status.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.status}`);
        }
        // Deleted user
        if (isUserExist.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
        }
        if (isUserExist.role === "AGENT" &&
            isUserExist.agentStatus !== "approved") {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, `Agent is ${isUserExist.status}. Please wait for admin approval.`);
        }
        // Role check
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.default(403, "You are not permitted to view this route!!!");
        }
        req.user = verifiedToken;
        req.tokenPayload = verifiedToken;
        next();
    }
    catch (error) {
        console.log("jwt error", error);
        next(error);
    }
});
exports.checkAuth = checkAuth;
