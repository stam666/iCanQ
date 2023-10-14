import { Router } from "express";
import { MenuController } from "../menus/controllers/menu.controller";

const menuRouter = Router();

menuRouter
  .get("/", MenuController.getAllMenus)
  .get("/:id", MenuController.getMenu);
menuRouter.post("/:restaurantId/createMenu", MenuController.createMenu);
menuRouter.put("/:id", MenuController.updateMenu);
menuRouter.delete("/:restaurantId/:id", MenuController.deleteMenu);

export default menuRouter;
