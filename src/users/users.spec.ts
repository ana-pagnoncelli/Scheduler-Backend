import request from "supertest";
import { httpServer } from "../setupTests";
import {
  updatedUserData,
  userData,
  userDataWithMissingName,
  wrongEmailLogin,
  wrongPasswordLogin
} from "./fixtures";

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
    it("Should return the all the users", async () => {
      const response = await request(httpServer).get("/users");
      expect(response.body).toMatchObject([userData]);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /:email ", () => {
    it("Should return the searched user", async () => {
      const response = await request(httpServer).get("/users/test@test");
      expect(response.body).toMatchObject(userData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT /:email ", () => {
    it("Should return the user updated", async () => {
      const response = await request(httpServer)
        .put("/users/test@test")
        .send(updatedUserData);
      expect(response.body).toMatchObject(updatedUserData);
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

  describe("DELETE /:email ", () => {
    it("Should delete the user", async () => {
      const response = await request(httpServer).delete(
        `/schedules/${userData.email}`
      );
      expect(response.statusCode).toBe(200);
    });
  });

  describe("POST /my-schedule/:email ", () => {
    it("Should return the user's schedule information", async () => {
      const response = await request(httpServer).get(
        `/users/my-schedule/${userData.email}`
      );
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("nextClass");
      expect(response.body).toHaveProperty("classesToRecover");
      expect(response.body).toHaveProperty("fixedSchedule");
      expect(response.body.nextClass).toBe("2025-08-25");
      expect(response.body.classesToRecover).toBe(2);
      expect(response.body.fixedSchedule).toBe(["MONDAY", "WEDNESDAY", "FRIDAY"]);
    });
  });
});
