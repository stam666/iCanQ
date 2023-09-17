import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
export interface RequestCustom extends Request {
    user: IUser;
}
const protect:RequestHandler = async (expressReq, res, next) => {
    const req = expressReq as RequestCustom;
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token || token === "null") {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log(decoded);

    // Fetch the user based on the decoded token's ID and attach it to the request
    const user: IUser | null = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
  }
};

const authorize = (...roles: string[]) => {
  return (req: any, res:any, next:any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

export const UserMiddleware = {
  protect,
  authorize,
};
