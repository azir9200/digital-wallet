export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}
export enum Status {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: Status;
  isDeleted?: string;
  commissionRate?: number; // Only for agents
  createdAt?: Date;
  updatedAt?: Date;
}
