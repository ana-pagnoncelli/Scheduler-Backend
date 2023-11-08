import request from "supertest";
import { httpServer } from "../setupTests";
import {
  scheduleData,
  scheduleWithMissingData,
  updatedScheduleData,
  userDataWithSchedule
} from "./fixtures";
import { userData } from "../users/fixtures";

describe("Schedules", () => {
  describe("POST / ", () => {
    it("Should create a schedule when all required fields are given", async () => {
      const response = await request(httpServer)
        .post("/schedules")
        .send(scheduleData);
      expect(response.statusCode).toBe(200);
    });
    it("Should not create a schedule when a field is missing", async () => {
      const response = await request(httpServer)
        .post("/schedules")
        .send(scheduleWithMissingData);
      expect(response.statusCode).toBe(500);
    });
  });

  describe("GET /:id ", () => {
    it("Should return the searched schedule", async () => {
      await request(httpServer).post("/schedules").send(scheduleData);
      const response = await request(httpServer).get("/schedules/1");
      expect(response.body).toMatchObject(scheduleData);
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

      await request(httpServer).post("/schedules").send(scheduleData);

      const response = await request(httpServer).put(
        `/schedules/addUser/${userData.email}/InSchedule/${scheduleData.id}`
      );

      expect(response.body).toMatchObject(updatedScheduleData);
      expect(response.statusCode).toBe(200);

      const userResponse = await request(httpServer).get(
        `/users/${userData.email}`
      );

      expect(userResponse.body).toMatchObject(userDataWithSchedule);
    });
  });
});
