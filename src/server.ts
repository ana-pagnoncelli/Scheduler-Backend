/** source/server.ts */
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import { router } from "./router.setup";
import { uri } from "../database.config";

// load the environment variables from the .env file
dotenv.config({
  path: ".env.local"
});

// Database connection
mongoose.connect(uri);

export const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully to database");
});

/** Server */
export const httpServer = http.createServer(router);
const PORT = 6060;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
