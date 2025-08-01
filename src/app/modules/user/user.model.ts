import { model, Schema } from "mongoose";
import { AgentStatus, IUser, Role, Status } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    agentStatus: {
      type: String,
      enum: Object.values(AgentStatus),
      default: AgentStatus.PENDING,
    },
    isDeleted: { type: Boolean, default: false },
    commissionRate: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
