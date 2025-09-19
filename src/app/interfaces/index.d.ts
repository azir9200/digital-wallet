import { IUser } from "../modules/user/user.interface";
import { CustomJwtPayload } from "../type/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      tokenPayload?: CustomJwtPayload;
    }
  }
}
