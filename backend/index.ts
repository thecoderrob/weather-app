import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import dotenv from "dotenv";
dotenv.config();

import { weatherRouter } from "./routers/weather";
export type WeatherRouter = typeof weatherRouter;

const app = express();
app.use(cors());
const port = 2022;

app.use(
  "/trpc",
  createExpressMiddleware({
    router: weatherRouter,
  })
);

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
