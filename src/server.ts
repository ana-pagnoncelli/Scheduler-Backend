/** source/server.ts */
import dotenv from "dotenv";
import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import { userRouter } from "./users";
import { uri } from "../database.config";

// load the environment variables from the .env file
dotenv.config({
  path: ".env.local"
});

// Database connection
mongoose.connect(uri);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully to database");
});

const router: Express = express();

/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
  // set the CORS policy
  res.header("Access-Control-Allow-Origin", "*");
  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
});

/** Routes */
router.use("/users", userRouter);

/** Error handling */
router.use((req, res) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message
  });
});

/** Server */
const httpServer = http.createServer(router);
const PORT = 6060;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
