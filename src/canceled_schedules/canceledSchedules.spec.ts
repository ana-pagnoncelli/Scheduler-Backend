import request from "supertest";
import { httpServer } from "../setupTests";
import {
  canceledScheduleData,
  canceledScheduleDataWithOneUser,
  canceledScheduleWithMissingData,
  updatedCanceledScheduleData,
  userDataWithSchedule
} from "./fixtures";
import { userData, userData2 } from "../users/fixtures";

describe("Canceled Schedules", () => {
  describe("POST / ", () => {
    it("Should create a canceled schedule when all required fields are given", async () => {
      const response = await request(httpServer)
        .post("/canceledSchedules")
        .send(canceledScheduleData);
      expect(response.statusCode).toBe(200);
    });
    it("Should not create a canceled schedule when a field is missing", async () => {
      const response = await request(httpServer)
        .post("/canceledSchedules")
        .send(canceledScheduleWithMissingData);
      expect(response.statusCode).toBe(500);
    });
  });

  describe("GET /:id ", () => {
    it("Should return the searched canceled schedule", async () => {
      await request(httpServer)
        .post("/canceledSchedules")
        .send(canceledScheduleData);
      const response = await request(httpServer).get("/canceledSchedules/1");
      expect(response.body).toMatchObject(canceledScheduleData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT /:id ", () => {
    it("Should return the canceled schedule updated", async () => {
      const response = await request(httpServer)
        .put("/canceledSchedules/1")
        .send(updatedCanceledScheduleData);
      expect(response.body).toMatchObject(updatedCanceledScheduleData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /:id ", () => {
    it("Should delete the canceled schedule", async () => {
      const response = await request(httpServer).delete("/canceledSchedules/1");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT addUser/:userEmail/InCanceledSchedule/:scheduleId ", () => {
    it("Should update the canceled schedule and the user", async () => {
      await request(httpServer).post("/users").send(userData);
      await request(httpServer).post("/users").send(userData2);

      await request(httpServer)
        .post("/canceledSchedules")
        .send(canceledScheduleData);

      await request(httpServer).put(
        `/canceledSchedules/addUser/${userData.email}/InCanceledSchedule/${canceledScheduleData.id}`
      );

      const response = await request(httpServer).put(
        `/canceledSchedules/addUser/${userData2.email}/InCanceledSchedule/${canceledScheduleData.id}`
      );

      expect(response.body).toMatchObject(updatedCanceledScheduleData);
      expect(response.statusCode).toBe(200);

      const userResponse = await request(httpServer).get(
        `/users/${userData.email}`
      );

      expect(userResponse.body).toMatchObject(userDataWithSchedule);
    });
  });

  describe("PUT removeUser/:userEmail/FromCanceledSchedule/:scheduleId ", () => {
    it("Should update the canceled schedule and the user", async () => {
      const response = await request(httpServer).put(
        `/canceledSchedules/removeUser/${userData.email}/FromCanceledSchedule/${canceledScheduleData.id}`
      );

      expect(response.body).toMatchObject(canceledScheduleDataWithOneUser);
      expect(response.statusCode).toBe(200);

      const userResponse = await request(httpServer).get(
        `/users/${userData.email}`
      );

      expect(userResponse.body).toMatchObject(userData);
    });
  });
});
