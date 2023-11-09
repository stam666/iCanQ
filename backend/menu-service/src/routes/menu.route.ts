import express from 'express';
import { MenuController } from '../controllers/menu.controller';

const router = express.Router();

router.get("/", MenuController.getAllMenus);
router.get("/:id", MenuController.getMenu);
router.post("/:restaurantId/createMenu", MenuController.createMenu);
router.put("/:id", MenuController.updateMenu);
router.delete("/:restaurantId/:id", MenuController.deleteMenu);

export const MenuRouter = router;