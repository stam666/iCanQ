import express from "express";
import { MenuController } from "../menus/controllers/menu.controller";

require("dotenv").config({
  path: "../../../../config.env",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.MENU_SERVICE_PORT || 8003;

app.get("/", MenuController.getAllMenus).get("/:id", MenuController.getMenu);
app.post("/:restaurantId/createMenu", MenuController.createMenu);
app.put("/:id", MenuController.updateMenu);
app.delete("/:restaurantId/:id", MenuController.deleteMenu);

app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Menu service is running at https://localhost:${PORT}`
  );
});
