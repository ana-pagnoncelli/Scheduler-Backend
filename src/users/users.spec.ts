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

const wrongEmailLogin = {
  email: "wrong@email",
  password: "test123"
};

const wrongPasswordLogin = {
  email: "test@test",
  password: "wrongPassword"
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

  describe("POST /login ", () => {
    it("Should return the status 200 if the email and password are correct", async () => {
      const response = await request(httpServer)
        .post("/users/login")
        .send(userData);

      expect(response.statusCode).toBe(200);
    });

    it("Should return the status 401 if the email is wrong", async () => {
      const response = await request(httpServer)
        .post("/users/login")
        .send(wrongEmailLogin);

      expect(response.statusCode).toBe(401);
    });

    it("Should return the status 401 if the password is wrong", async () => {
      const response = await request(httpServer)
        .post("/users/login")
        .send(wrongPasswordLogin);

      expect(response.statusCode).toBe(401);
    });
  });
});
