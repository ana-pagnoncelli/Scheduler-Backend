/** source/server.ts */
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import { router } from "./router.setup";

// load the environment variables from the .env file
dotenv.config({
  path: ".env"
});

// Database connection
(async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}`);
  } catch (error) {
    console.error("Failed to connect to DATABASE_URL, trying DATABASE_LOCAL:", error);
    try {
      await mongoose.connect(`${process.env.DATABASE_LOCAL}`);
    } catch (localError) {
      console.error("Failed to connect to DATABASE_LOCAL:", localError);
      throw localError;
    }
  }
})();

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
