import request from "supertest";
import { httpServer } from "../setupTests";

const userData = {
  name: "Test",
  email: "test@test",
  password: "test123",
  age: 32
};

describe("Users", () => {
  describe("POST / ", () => {
    it("Should create a user", async () => {
      const response = await request(httpServer).post("/users").send(userData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET / ", () => {
    it("Should return the created user", async () => {
      const response = await request(httpServer).get("/users");
      expect(response.body).toMatchObject([userData]);
      expect(response.statusCode).toBe(200);
    });
  });
});
