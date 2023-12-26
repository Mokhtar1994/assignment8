import userRouters from "./src/modules/auth/authRouters.js";
import taskRouter from "./src/modules/task/taskRouters.js";
import express from "express";
import { connectDB } from "./DB/connection.js";
import { globalErrorHandler } from "./util/globalErrorHandler.js";
import { notFoundPageHandler } from "./util/notFoundPageHandler.js";

export let bootstrap = async (app) => {
  await connectDB();
  app.use(express.json());
  app.use("/auth", userRouters);
  app.use("/task", taskRouter);
  app.all("*", notFoundPageHandler);
  app.use(globalErrorHandler);
};
