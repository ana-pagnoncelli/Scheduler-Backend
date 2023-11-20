import request from "supertest";
import { httpServer } from "../setupTests";
import {
  variableScheduleData,
  variableScheduleDataWithOneUser,
  variableScheduleWithMissingData,
  updatedVariableScheduleData,
  userDataWithSchedule,
  scheduleData2,
  variableScheduleBaseData2
} from "./fixtures";
import { userData, userData2 } from "../users/fixtures";
import { scheduleData } from "../fixed_schedules/fixtures";
import { SchedulesReturn } from "./variableSchedule";

describe("Variable Schedules", () => {
  describe("POST / ", () => {
    it("Should create a variable schedule when all required fields are given", async () => {
      const response = await request(httpServer)
        .post("/variableSchedules")
        .send(variableScheduleData);
      expect(response.statusCode).toBe(200);
    });
    it("Should not create a variable schedule when a field is missing", async () => {
      const response = await request(httpServer)
        .post("/variableSchedules")
        .send(variableScheduleWithMissingData);
      expect(response.statusCode).toBe(500);
    });
  });

  describe("GET /:id ", () => {
    it("Should return the searched variable schedule", async () => {
      await request(httpServer)
        .post("/variableSchedules")
        .send(variableScheduleData);
      const response = await request(httpServer).get("/variableSchedules/1");
      expect(response.body).toMatchObject(variableScheduleData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT /:id ", () => {
    it("Should return the schedule updated", async () => {
      const response = await request(httpServer)
        .put("/variableSchedules/1")
        .send(updatedVariableScheduleData);
      expect(response.body).toMatchObject(updatedVariableScheduleData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /:id ", () => {
    it("Should delete the variable schedule", async () => {
      const response = await request(httpServer).delete("/variableSchedules/1");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT addUser/:userEmail/InVariableSchedule/:scheduleId ", () => {
    it("Should update the variable schedule and the user", async () => {
      await request(httpServer).post("/users").send(userData);
      await request(httpServer).post("/users").send(userData2);

      await request(httpServer)
        .post("/variableSchedules")
        .send(variableScheduleData);

      await request(httpServer).put(
        `/variableSchedules/addUser/${userData.email}/InVariableSchedule/${variableScheduleData.id}`
      );

      const response = await request(httpServer).put(
        `/variableSchedules/addUser/${userData2.email}/InVariableSchedule/${variableScheduleData.id}`
      );

      expect(response.body).toMatchObject(updatedVariableScheduleData);
      expect(response.statusCode).toBe(200);

      const userResponse = await request(httpServer).get(
        `/users/${userData.email}`
      );

      expect(userResponse.body).toMatchObject(userDataWithSchedule);
    });
  });

  describe("PUT removeUser/:userEmail/FromVariableSchedule/:scheduleId ", () => {
    it("Should update the variable schedule and the user", async () => {
      const response = await request(httpServer).put(
        `/variableSchedules/removeUser/${userData.email}/FromVariableSchedule/${variableScheduleData.id}`
      );

      expect(response.body).toMatchObject(variableScheduleDataWithOneUser);
      expect(response.statusCode).toBe(200);

      const userResponse = await request(httpServer).get(
        `/users/${userData.email}`
      );

      expect(userResponse.body).toMatchObject(userData);
    });
  });

  describe("GET variableSchedules/forAListOfDays ", () => {
    it("Should get the schedule for a list of days", async () => {
      const listOfDays = [
        { week_day: "MONDAY", date: "2023-04-20" },
        { week_day: "TUESDAY", date: "2023-04-21" }
      ];

      await request(httpServer).post("/schedules").send(scheduleData);
      await request(httpServer).post("/schedules").send(scheduleData2);

      await request(httpServer)
        .post("/variableSchedules")
        .send(variableScheduleData);

      await request(httpServer)
        .post("/variableSchedules")
        .send(variableScheduleBaseData2);

      const response = await request(httpServer)
        .get(`/variableSchedules/forAListOfDays/`)
        .send(listOfDays);

      const result: Array<SchedulesReturn> = [
        {
          day: "2023-04-20",
          numberOfSpots: 2,
          availableSpots: 2,
          hours: [{ hour: "18:00", numberOfSpots: 2, availableSpots: 2 }]
        },

        {
          day: "2023-04-21",
          numberOfSpots: 2,
          availableSpots: 2,
          hours: [
            { hour: "11:00", numberOfSpots: 2, availableSpots: 1 },
            { hour: "15:00", numberOfSpots: 2, availableSpots: 1 }
          ]
        }
      ];

      expect(response.body).toMatchObject(result);
      expect(response.statusCode).toBe(200);
    });
  });
});
