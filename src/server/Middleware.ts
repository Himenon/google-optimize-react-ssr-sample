import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const create = (app: express.Application) => {
  app.use(
    cors({
      origin: "*",
    }),
  );
  app.use(cookieParser());
};
