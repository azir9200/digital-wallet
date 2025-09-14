"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER,
    },
    mobile: { type: String },
    status: {
        type: String,
        enum: Object.values(user_interface_1.Status),
        default: user_interface_1.Status.ACTIVE,
    },
    agentStatus: {
        type: String,
        enum: Object.values(user_interface_1.AgentStatus),
        default: user_interface_1.AgentStatus.PENDING,
    },
    isDeleted: { type: Boolean, default: false },
    commissionRate: { type: Number },
}, {
    timestamps: true,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
