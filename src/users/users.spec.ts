import request from "supertest";
import { httpServer } from "../setupTests";

const userData = {
  name: "Test",
  email: "test@test",
  password: "test123",
  age: 32
};

const userDataWithMissingName = {
  email: "test@test",
  password: "test123",
  age: 32
};

describe("Users", () => {
  describe("POST / ", () => {
    it("Should create a user when all required fields are given", async () => {
      const response = await request(httpServer).post("/users").send(userData);
      expect(response.statusCode).toBe(200);
    });
    it("Should not create a user when a field is missing", async () => {
      const response = await request(httpServer)
        .post("/users")
        .send(userDataWithMissingName);
      expect(response.statusCode).toBe(500);
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
