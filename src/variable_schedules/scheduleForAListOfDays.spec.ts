import request from "supertest";
import { httpServer } from "../setupTests";
import {
  variableScheduleData,
  scheduleData2,
  variableScheduleBaseData2
} from "./fixtures";
import { scheduleData } from "../fixed_schedules/fixtures";
import { SchedulesReturn } from "./variableSchedule";
import { ScheduleType } from "../fixed_schedules";

describe("Variable Schedules", () => {
  describe("test sortings ", () => {
    it("should sort the schedules by hour", () => {
      const scheduleList: Array<ScheduleType> = [
        {
          id: "1",
          week_day: "MONDAY",
          hour_of_the_day: "18:00",
          users_list: [],
          number_of_spots: 1
        },
        {
          id: "2",
          week_day: "MONDAY",
          hour_of_the_day: "17:00",
          users_list: [],
          number_of_spots: 1
        },
        {
          id: "3",
          week_day: "MONDAY",
          hour_of_the_day: "17:30",
          users_list: [],
          number_of_spots: 1
        }
      ];
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
        .get("/variableSchedules/get/forAListOfDays")
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
