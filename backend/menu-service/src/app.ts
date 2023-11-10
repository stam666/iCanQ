import express from "express";
require("dotenv").config({
  path: "../config.env",
});

import { MenuRouter } from "./routes/menu.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", MenuRouter);

const PORT = process.env.MENU_SERVICE_PORT || 8003;

app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Menu service is running at https://localhost:${PORT}`
  );
});
