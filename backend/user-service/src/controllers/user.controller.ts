import { RequestHandler, Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { RequestCustom } from "../middleware/user.middleware";
import axios from "axios";
async function createRestaurant(
  userId: string,
  restaurantName: string,
  restaurantInfo: string,
  openStatus: boolean
) {
  try {
    await axios.post(`http://localhost:${process.env.PORT}/restaurants/`, {
      userId: userId,
      restaurantName: restaurantName,
      restaurantInfo: restaurantInfo,
      openStatus: openStatus,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({});
  }
};
const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    _id: user._id,
    name: user.userName,
    email: user.email,
    role: user.role,
    token,
  });
};

const register: RequestHandler = async (req, res) => {
  try {
    const {
      email,
      userName,
      firstName,
      lastName,
      role,
      password,
      restaurantName,
      restaurantInfo,
      openStatus,
    } = req.body;
    console.log(req.body);
    const user = await User.create({
      email,
      userName,
      firstName,
      lastName,
      role,
      password,
    });

    if (role === "restaurant") {
      const isSuccess = createRestaurant(
        user._id,
        restaurantName,
        restaurantInfo,
        openStatus
      );
      if (isSuccess) {
        console.log("Restaurant created");
      } else {
        console.log("Restaurant not created");
      }
    }
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
    });
    console.error(err);
  }
};
const login: RequestHandler = async (req, res) => {
  try {
    const { input, password } = req.body;
    if (!input || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please provide an email or username and password",
      });
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isEmail = emailPattern.test(input);
    var user: IUser;
    if (isEmail) {
      user = await User.findOne({ email: input }).select("+password");
    } else {
      user = await User.findOne({ userName: input }).select("+password");
    }
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

const getMe: RequestHandler = async (expressReq, res) => {
  const req = expressReq as RequestCustom;
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};

const logout: RequestHandler = async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
};

const updateUser: RequestHandler = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

const deleteUser: RequestHandler = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

export const UserController = {
  getAllUsers,
  register,
  login,
  getMe,
  logout,
  updateUser,
  deleteUser,
};
