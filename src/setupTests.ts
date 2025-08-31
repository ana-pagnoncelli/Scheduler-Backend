import mongoose from "mongoose";
import http from "http";
import { router } from "./router.setup";
import { uriTest } from "../database.config";

let httpServer: http.Server;
const PORT = 6060;

beforeAll(async () => {
  try {
    httpServer = http.createServer(router);

    // Handle port conflicts gracefully
    const serverPromise = new Promise<void>((resolve, reject) => {
      httpServer.once("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          console.log(`Port ${PORT} is busy, trying alternative port...`);
          httpServer.listen(0, () => {
            const actualPort = (httpServer.address() as any).port;
            console.log(`Server is running on port ${actualPort}`);
            resolve();
          });
        } else {
          reject(err);
        }
      });

      httpServer.listen(PORT, () => {
        console.log(`The server is running on port ${PORT}`);
        resolve();
      });
    });

    await serverPromise;
    await mongoose.connect(uriTest);
  } catch (error) {
    console.error("Failed to start test server:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    if (httpServer) {
      httpServer.close();
    }
  } catch (error) {
    console.error("Error during test cleanup:", error);
  }
});

export { httpServer };
