export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}
export enum Status {
  ACTIVE = "ACTIVE",
  InACTIVE = "InACTIVE",
  BLOCKED = "BLOCKED",
}

export enum AgentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  SUSPENDED = "suspended",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  mobile?: string;
  status: Status;
  agentStatus: AgentStatus;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  commissionRate?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
