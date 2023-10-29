import { Router } from "express";
import { UserController } from "./controllers/user.controller";
import { UserMiddleware } from "./middleware/user.middleware";
import mongoose from "mongoose";
require("dotenv").config({
  path: "./config.env",
});
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";
mongoose.connect(mongoUrl);
console.log("Connected to MongoDB on " + mongoUrl);
const userRouter = Router();

//get all users
userRouter.get("/", UserController.getAllUsers);
userRouter
  .put("/:id", UserMiddleware.protect, UserController.updateUser)
  .delete("/:id", UserMiddleware.protect, UserController.deleteUser);
userRouter
  .post("/auth/register", UserController.register)
  .post("/auth/login", UserController.login)
  .get("/auth/me", UserMiddleware.protect, UserController.getMe)
  .get("/auth/logout", UserController.logout);
export default userRouter;
