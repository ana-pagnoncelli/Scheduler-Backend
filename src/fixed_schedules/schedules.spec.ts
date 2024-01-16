import request from "supertest";
import { httpServer } from "../setupTests";
import {
  scheduleData,
  scheduleDataWithOneUser,
  scheduleWithMissingData,
  updatedScheduleData
} from "./fixtures";
import { userData, userData2 } from "../users/fixtures";

describe("Schedules", () => {
  describe("POST / ", () => {
    it("Should create a schedule when all required fields are given", async () => {
      const response = await request(httpServer)
        .post("/schedules")
        .send(scheduleData);
      expect(response.statusCode).toBe(201);
    });
    it("Should not create a schedule when a field is missing", async () => {
      const response = await request(httpServer)
        .post("/schedules")
        .send(scheduleWithMissingData);
      expect(response.statusCode).toBe(500);
    });
    it("Should not create a schedule when the same hour and day are given", async () => {
      const response = await request(httpServer)
        .post("/schedules")
        .send(scheduleData);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("This schedule already exists");
    });
  });

  describe("GET /byId/:id ", () => {
    it("Should return the searched schedule", async () => {
      await request(httpServer).post("/schedules").send(scheduleData);
      const response = await request(httpServer).get("/schedules/byId/1");
      expect(response.body).toMatchObject(scheduleData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /all ", () => {
    it("Should return the all the schedules", async () => {
      await request(httpServer).post("/schedules").send(scheduleData);
      const response = await request(httpServer).get("/schedules/all");
      expect(response.body).toMatchObject([scheduleData]);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT /:id ", () => {
    it("Should return the schedule updated", async () => {
      const response = await request(httpServer)
        .put("/schedules/1")
        .send(updatedScheduleData);
      expect(response.body).toMatchObject(updatedScheduleData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /:id ", () => {
    it("Should delete the schedule", async () => {
      const response = await request(httpServer).delete("/schedules/1");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT addUser/:userEmail/InSchedule/:scheduleId ", () => {
    it("Should update the schedule and the user", async () => {
      await request(httpServer).post("/users").send(userData);
      await request(httpServer).post("/users").send(userData2);

      await request(httpServer).post("/schedules").send(scheduleData);

      await request(httpServer).put(
        `/schedules/addUser/${userData.email}/InSchedule/${scheduleData.id}`
      );

      const response = await request(httpServer).put(
        `/schedules/addUser/${userData2.email}/InSchedule/${scheduleData.id}`
      );

      expect(response.body).toMatchObject(updatedScheduleData);
      expect(response.statusCode).toBe(200);

      const userResponse = await request(httpServer).get(
        `/users/${userData.email}`
      );

      expect(userResponse.body).toMatchObject({
        ...userData,
        fixed_schedules: [
          {
            id: "1",
            week_day: "MONDAY",
            hour_of_the_day: "18:00"
          }
        ]
      });
    });
  });

  describe("PUT removeUser/:userEmail/FromSchedule/:scheduleId ", () => {
    it("Should update the schedule and the user", async () => {
      const response = await request(httpServer).put(
        `/schedules/removeUser/${userData.email}/FromSchedule/${scheduleData.id}`
      );

      expect(response.body).toMatchObject(scheduleDataWithOneUser);
      expect(response.statusCode).toBe(200);

      const userResponse = await request(httpServer).get(
        `/users/${userData.email}`
      );

      expect(userResponse.body).toMatchObject(userData);
    });
  });
});
