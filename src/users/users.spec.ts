import request from "supertest";
import { httpServer } from "../setupTests";
import {
  updatedUserData,
  userData,
  userDataWithMissingName,
  wrongEmailLogin,
  wrongPasswordLogin,
  userWithFixedSchedules,
  userWithVariableSchedules,
  userWithMixedSchedules,
  userWithNoSchedules
} from "./fixtures";
import { NO_CLASS_SCHEDULED_FOR_USER } from "../utils/constants";

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
});

describe("POST /my-schedule/:email/:referenceDate", () => {
  it("Should return user schedule information with fixed schedules", async () => {
    // Create a user with fixed schedules first
    await request(httpServer).post("/users").send(userWithFixedSchedules);

    // Test the myScheduleInfo endpoint
    const response = await request(httpServer)
      .post(`/users/my-schedule/${userWithFixedSchedules.email}/2024-01-15`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("nextClass");
    expect(response.body).toHaveProperty("numberOfClassesToRecover");
    expect(response.body).toHaveProperty("fixedSchedulesDays");
    expect(response.body.nextClass).toBe("2024-01-15");
    expect(response.body.numberOfClassesToRecover).toBe(2);
    expect(response.body.fixedSchedulesDays).toEqual([
      "MONDAY 10:00",
      "WEDNESDAY 14:00"
    ]);
  });

  it("Should return user schedule information with variable schedules", async () => {
    // Create a user with variable schedules
    await request(httpServer).post("/users").send(userWithVariableSchedules);

    // Test the myScheduleInfo endpoint
    const response = await request(httpServer)
      .post(`/users/my-schedule/${userWithVariableSchedules.email}/2024-01-15`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("nextClass");
    expect(response.body).toHaveProperty("numberOfClassesToRecover");
    expect(response.body).toHaveProperty("fixedSchedulesDays");
    expect(response.body.nextClass).toBe("2024-01-20");
    expect(response.body.numberOfClassesToRecover).toBe(2);
    expect(response.body.fixedSchedulesDays).toEqual([]);
  });

  it("Should return user schedule information with mixed schedules", async () => {
    // Create a user with both fixed and variable schedules
    await request(httpServer).post("/users").send(userWithMixedSchedules);

    // Test the myScheduleInfo endpoint
    const response = await request(httpServer)
      .post(`/users/my-schedule/${userWithMixedSchedules.email}/2024-01-15`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("nextClass");
    expect(response.body).toHaveProperty("numberOfClassesToRecover");
    expect(response.body).toHaveProperty("fixedSchedulesDays");
    expect(response.body.nextClass).toBe("2024-01-19");
    expect(response.body.numberOfClassesToRecover).toBe(2);
    expect(response.body.fixedSchedulesDays).toEqual([
      "FRIDAY 09:00"
    ]);
  });

  it("Should return 404 when user is not found", async () => {
    const response = await request(httpServer)
      .post(`/users/my-schedule/nonexistent@test.com/2024-01-15`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("User not found");
  });

  it("Should handle user with no schedules", async () => {
    // Create a user with no schedules
    await request(httpServer).post("/users").send(userWithNoSchedules);

    // Test the myScheduleInfo endpoint
    const response = await request(httpServer)
      .post(`/users/my-schedule/${userWithNoSchedules.email}/2024-01-15`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("nextClass");
    expect(response.body).toHaveProperty("numberOfClassesToRecover");
    expect(response.body).toHaveProperty("fixedSchedulesDays");
    expect(response.body.nextClass).toBe(NO_CLASS_SCHEDULED_FOR_USER);
    expect(response.body.numberOfClassesToRecover).toBe(2);
    expect(response.body.fixedSchedulesDays).toEqual([]);
  });
});
