import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { RestaurantService } from "../services/restaurant.service";
import { IRestaurant } from "../resources/interfaces/restaurnat.type";
import { Socket } from "socket.io";
export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export interface RestaurantRequest extends AuthenticatedRequest {
  restaurant: IRestaurant;
}

export interface AuthSocket extends Socket {
  room: string;
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

const authSocket = async (socket: AuthSocket, next) => {
  const token = socket.handshake.query?.token;
  if (!token || token === "null") {
    return next(new Error("Not authorized to access this route"));
  }
  try {
    const decoded: any = jwt.verify(token as string, process.env.JWT_SECRET!);
    const user: IUser = await User.findById(decoded.id);
    if (!user) {
      return next(new Error("Not authorized socket"));
    }
    // if restaurant, join restaurant room
    if (user.role === "restaurant") {
      const restaurant = await RestaurantService.getRestaurantByUserId(
        user._id
      );
      socket.room = restaurant._id;
    } else {
      socket.room = user._id;
    }
    next();
  } catch (err) {
    console.error(err);
    return next(new Error("Not authorized socket"));
  }
};

export const AuthMiddleware = {
  protect,
  authorize,
  authSocket,
};
