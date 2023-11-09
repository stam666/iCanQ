
import { UserMiddleware } from "../middleware/user.middleware";
import { UserController } from "../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.get("/", UserController.getAllUsers);
router.post("/auth/register", UserController.register);
router.post("/auth/login", UserController.login);
router.get("/auth/me", UserMiddleware.protect, UserController.getMe);
router.get("/auth/logout", UserController.logout);

export const UserRouter = router;
