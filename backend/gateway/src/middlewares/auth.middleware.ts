import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { RestaurantService } from "../services/restaurant.service";
import { IRestaurant } from "../resources/interfaces/restaurnat.type";
export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export interface RestaurantRequest extends AuthenticatedRequest {
  restaurant: IRestaurant;
}

const protect: RequestHandler = async (expressReq, res, next) => {
  const req = expressReq as AuthenticatedRequest;
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
  return async (req: any, res: any, next: any) => {
    const { role, _id } = req.user;

    if (!roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${role} is not authorized to access this route`,
      });
    }

    if (role === "restaurant") {
      try {
        const restaurant = await RestaurantService.getRestaurantByUserId(_id);
        if (!restaurant) {
          throw new Error();
        }
        req.restaurant = restaurant;
      } catch (err) {
        return res.status(403).json({
          success: false,
          message: `User role ${role} is not authorized to access this route`,
        });
      }
    }

    next();
  };
};

export const AuthMiddleware = {
  protect,
  authorize,
};
