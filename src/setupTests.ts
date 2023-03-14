import mongoose from "mongoose";
import http from "http";
import { router } from "./router.setup";
import { uriTest } from "../database.config";

const httpServer = http.createServer(router);
const PORT = 6060;

beforeAll(async () => {
  httpServer.listen(PORT, () =>
    console.log(`The server is running on port ${PORT}`)
  );
  await mongoose.connect(uriTest);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  httpServer.close();
});

export { httpServer };
