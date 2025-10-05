import request from "supertest";
import { httpServer } from "../setupTests";
import {
  canceledScheduleDataWithOneUser,
  addCanceledScheduleData,
  addCanceledScheduleData2,
  newCanceledScheduleExpected,
  existingCanceledScheduleExpected
} from "./fixtures";
import { userData, userData2 } from "../users/fixtures";

describe("Canceled Schedules", () => {
  describe("GET /:id ", () => {
    it("Should return the searched canceled schedule", async () => {
      // Create a user first
      await request(httpServer).post("/users").send(userData);

      // Create a canceled schedule using the new addCanceledSchedule function
      await request(httpServer)
        .post("/canceledSchedules")
        .send(addCanceledScheduleData);

      const response = await request(httpServer).get(
        "/canceledSchedules/2023-04-21_19:00"
      );
      expect(response.body).toMatchObject(newCanceledScheduleExpected);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /:id ", () => {
    it("Should delete the canceled schedule", async () => {
      // Create a user first
      await request(httpServer).post("/users").send(userData);

      // Create a canceled schedule
      await request(httpServer)
        .post("/canceledSchedules")
        .send(addCanceledScheduleData);

      const response = await request(httpServer).delete(
        "/canceledSchedules/2023-04-21_19:00"
      );
      expect(response.statusCode).toBe(200);
    });
  });

  describe("POST / (addCanceledSchedule)", () => {
    it("Should create a new canceled schedule when no schedule exists for the given day and hour", async () => {
      // Create users first
      await request(httpServer).post("/users").send(userData);

      const response = await request(httpServer)
        .post("/canceledSchedules")
        .send(addCanceledScheduleData);

      expect(response.statusCode).toBe(200);
      expect(response.body.day).toBe(newCanceledScheduleExpected.day);
      expect(response.body.hour_of_the_day).toBe(
        newCanceledScheduleExpected.hour_of_the_day
      );
      expect(response.body.id).toBe(newCanceledScheduleExpected.id);
      expect(response.body.users_list).toContain("test@test");
    });

    it("Should add user to existing canceled schedule when schedule already exists for the given day and hour", async () => {
      // Create users first
      await request(httpServer).post("/users").send(userData);
      await request(httpServer).post("/users").send(userData2);

      // First, create a canceled schedule
      await request(httpServer)
        .post("/canceledSchedules")
        .send(addCanceledScheduleData);

      // Then add another user to the same schedule
      const response = await request(httpServer)
        .post("/canceledSchedules")
        .send(addCanceledScheduleData2);

      expect(response.statusCode).toBe(200);
      expect(response.body.day).toBe(existingCanceledScheduleExpected.day);
      expect(response.body.hour_of_the_day).toBe(
        existingCanceledScheduleExpected.hour_of_the_day
      );
      expect(response.body.id).toBe(existingCanceledScheduleExpected.id);
      expect(response.body.users_list).toContain("test@test");
      expect(response.body.users_list).toContain("test@test2");
      expect(response.body.users_list.length).toBe(2);
    });

    it("Should return 500 when user does not exist", async () => {
      const response = await request(httpServer)
        .post("/canceledSchedules")
        .send({
          userEmail: "nonexistent@test.com",
          day: addCanceledScheduleData.day,
          hour: addCanceledScheduleData.hour
        });

      expect(response.statusCode).toBe(500);
    });
  });
});
