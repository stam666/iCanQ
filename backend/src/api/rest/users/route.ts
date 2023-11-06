import express from "express";
import { UserController } from "./controllers/user.controller";
import { UserMiddleware } from "./middleware/user.middleware";
import mongoose from "mongoose";
require("dotenv").config({
  path: "../../../../config.env",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.USER_SERVICE_PORT || 8001;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";
mongoose.connect(mongoUrl);
console.log("Connected to MongoDB on " + mongoUrl);

//get all users
app.get("/", UserController.getAllUsers);
app
  .put("/:id", UserMiddleware.protect, UserController.updateUser)
  .delete("/:id", UserMiddleware.protect, UserController.deleteUser);
app
  .post("/auth/register", UserController.register)
  .post("/auth/login", UserController.login)
  .get("/auth/me", UserMiddleware.protect, UserController.getMe)
  .get("/auth/logout", UserController.logout);

app.listen(PORT, () => {
  console.log(
    `⚡️[server]: User service is running at https://localhost:${PORT}`
  );
});
