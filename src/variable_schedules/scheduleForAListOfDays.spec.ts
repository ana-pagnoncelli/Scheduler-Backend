import request from "supertest";
import { httpServer } from "../setupTests";
import {
  fixedScheduleMonday17,
  fixedScheduleMonday1730,
  variableScheduleMonday18,
  variableScheduleMonday1730,
  variableScheduleMonday17,
  canceledScheduleMonday18,
  canceledScheduleMonday17,
  canceledScheduleMonday1730,
  fixedScheduleMonday18,
  fixedScheduleTuesday1730
} from "./fixtures";
import { scheduleData } from "../fixed_schedules/fixtures";
import { SchedulesReturn, VariableScheduleType } from "./variableSchedule";
import { ScheduleType } from "../fixed_schedules";
import {
  applyCanceledSchedules,
  applyFixedSchedules,
  applyVariableSchedules,
  compareCanceledSchedule,
  compareSchedule,
  compareVariableSchedule
} from "./scheduleForAListOfDays";
import { CanceledSchedulesType } from "../canceled_schedules";

const day = "MONDAY";

describe("Variable Schedules", () => {
  describe("test sorts ", () => {
    it("should sort the schedules by hour", () => {
      const scheduleList: Array<ScheduleType> = [
        scheduleData,
        fixedScheduleMonday17,
        fixedScheduleMonday1730
      ];

      const expectedSchedule: Array<ScheduleType> = [
        fixedScheduleMonday17,
        fixedScheduleMonday1730,
        scheduleData
      ];
      const sortedSchedule = scheduleList.sort(compareSchedule);

      expect(sortedSchedule).toStrictEqual(expectedSchedule);
    });

    it("should sort the variable schedule by hour", () => {
      const variableScheduleList: Array<VariableScheduleType> = [
        variableScheduleMonday18,
        variableScheduleMonday1730,
        variableScheduleMonday17
      ];

      const expectedVariableSchedule: Array<VariableScheduleType> = [
        variableScheduleMonday17,
        variableScheduleMonday1730,
        variableScheduleMonday18
      ];
      const sortedSchedule = variableScheduleList.sort(compareVariableSchedule);

      expect(sortedSchedule).toStrictEqual(expectedVariableSchedule);
    });

    it("should sort the canceled schedule by hour", () => {
      const canceledScheduleList: Array<CanceledSchedulesType> = [
        canceledScheduleMonday18,
        canceledScheduleMonday17,
        canceledScheduleMonday1730
      ];

      const expectedCanceledSchedule: Array<CanceledSchedulesType> = [
        canceledScheduleMonday17,
        canceledScheduleMonday1730,
        canceledScheduleMonday18
      ];
      const sortedSchedule = canceledScheduleList.sort(compareCanceledSchedule);

      expect(sortedSchedule).toStrictEqual(expectedCanceledSchedule);
    });
  });

  describe("test apply schedules to the schedule return", () => {
    it("should apply the fixed schedules", () => {
      const schedules: Array<ScheduleType> = [
        fixedScheduleMonday17,
        fixedScheduleMonday1730,
        scheduleData
      ];

      const scheduleReturn = applyFixedSchedules(schedules, day);

      const expectedReturn: SchedulesReturn = {
        day,
        numberOfSpots: 4,
        availableSpots: 3,
        hours: [
          {
            hour: "17:00",
            numberOfSpots: 1,
            availableSpots: 0
          },
          {
            hour: "17:30",
            numberOfSpots: 1,
            availableSpots: 1
          },
          {
            hour: "18:00",
            numberOfSpots: 2,
            availableSpots: 2
          }
        ]
      };
      expect(scheduleReturn).toStrictEqual(expectedReturn);
    });

    it("should apply the variable schedules", () => {
      const schedules: Array<VariableScheduleType> = [
        variableScheduleMonday17,
        variableScheduleMonday1730,
        variableScheduleMonday18
      ];

      const scheduleReturn: SchedulesReturn = {
        day,
        numberOfSpots: 4,
        availableSpots: 3,
        hours: [
          {
            hour: "17:00",
            numberOfSpots: 1,
            availableSpots: 0
          },
          {
            hour: "17:30",
            numberOfSpots: 1,
            availableSpots: 1
          },
          {
            hour: "18:00",
            numberOfSpots: 2,
            availableSpots: 2
          }
        ]
      };

      const scheduleReturnResult = applyVariableSchedules(
        schedules,
        scheduleReturn
      );

      const expectedReturn: SchedulesReturn = {
        day,
        numberOfSpots: 4,
        availableSpots: 2,
        hours: [
          {
            hour: "17:00",
            numberOfSpots: 1,
            availableSpots: 0
          },
          {
            hour: "17:30",
            numberOfSpots: 1,
            availableSpots: 1
          },
          {
            hour: "18:00",
            numberOfSpots: 2,
            availableSpots: 1
          }
        ]
      };
      expect(scheduleReturnResult).toStrictEqual(expectedReturn);
    });

    it("should apply the canceled schedules", () => {
      const schedules: Array<CanceledSchedulesType> = [
        canceledScheduleMonday17
      ];

      const scheduleReturn: SchedulesReturn = {
        day,
        numberOfSpots: 4,
        availableSpots: 3,
        hours: [
          {
            hour: "17:00",
            numberOfSpots: 1,
            availableSpots: 0
          },
          {
            hour: "17:30",
            numberOfSpots: 1,
            availableSpots: 1
          },
          {
            hour: "18:00",
            numberOfSpots: 2,
            availableSpots: 1
          }
        ]
      };

      const scheduleReturnResult = applyCanceledSchedules(
        schedules,
        scheduleReturn
      );

      const expectedReturn: SchedulesReturn = {
        day,
        numberOfSpots: 4,
        availableSpots: 4,
        hours: [
          {
            hour: "17:00",
            numberOfSpots: 1,
            availableSpots: 1
          },
          {
            hour: "17:30",
            numberOfSpots: 1,
            availableSpots: 1
          },
          {
            hour: "18:00",
            numberOfSpots: 2,
            availableSpots: 1
          }
        ]
      };
      expect(scheduleReturnResult).toStrictEqual(expectedReturn);
    });
  });

  describe("POST variableSchedules/forAListOfDays ", () => {
    it("Should get the schedule for a list of days when there is a variable schedule", async () => {
      const listOfDays = [
        { week_day: "MONDAY", date: "2023-02-03" },
        { week_day: "TUESDAY", date: "2023-02-04" }
      ];

      await request(httpServer)
        .post("/schedules")
        .send(fixedScheduleMonday1730);
      await request(httpServer).post("/schedules").send(fixedScheduleMonday18);
      await request(httpServer).post("/schedules").send(fixedScheduleMonday17);

      await request(httpServer)
        .post("/schedules")
        .send(fixedScheduleTuesday1730);

      await request(httpServer)
        .post("/variableSchedules")
        .send(variableScheduleMonday18);

      const result: Array<SchedulesReturn> = [
        {
          day: "2023-02-03",
          numberOfSpots: 4,
          availableSpots: 1,
          hours: [
            { hour: "17:00", numberOfSpots: 1, availableSpots: 0 },
            { hour: "17:30", numberOfSpots: 1, availableSpots: 1 },
            { hour: "18:00", numberOfSpots: 2, availableSpots: 0 }
          ]
        },

        {
          day: "2023-02-04",
          numberOfSpots: 1,
          availableSpots: 1,
          hours: [{ hour: "17:30", numberOfSpots: 1, availableSpots: 1 }]
        }
      ];

      const response = await request(httpServer)
        .post("/variableSchedules/get/forAListOfDays")
        .send(listOfDays);

      expect(response.body).toMatchObject(result);
      expect(response.statusCode).toBe(200);
    });

    it("Should get the schedule for a list of days when there is a variable and a canceled schedule", async () => {
      const listOfDays = [
        { week_day: "MONDAY", date: "2023-02-03" },
        { week_day: "TUESDAY", date: "2023-02-04" }
      ];

      await request(httpServer)
        .post("/schedules")
        .send(fixedScheduleMonday1730);
      await request(httpServer).post("/schedules").send(fixedScheduleMonday18);
      await request(httpServer).post("/schedules").send(fixedScheduleMonday17);

      await request(httpServer)
        .post("/schedules")
        .send(fixedScheduleTuesday1730);

      await request(httpServer)
        .post("/variableSchedules")
        .send(variableScheduleMonday18);

      await request(httpServer)
        .post("/canceledSchedules")
        .send(canceledScheduleMonday17);

      const result: Array<SchedulesReturn> = [
        {
          day: "2023-02-03",
          numberOfSpots: 4,
          availableSpots: 2,
          hours: [
            { hour: "17:00", numberOfSpots: 1, availableSpots: 1 },
            { hour: "17:30", numberOfSpots: 1, availableSpots: 1 },
            { hour: "18:00", numberOfSpots: 2, availableSpots: 0 }
          ]
        },

        {
          day: "2023-02-04",
          numberOfSpots: 1,
          availableSpots: 1,
          hours: [{ hour: "17:30", numberOfSpots: 1, availableSpots: 1 }]
        }
      ];

      const response = await request(httpServer)
        .post("/variableSchedules/get/forAListOfDays")
        .send(listOfDays);

      expect(response.body).toMatchObject(result);
      expect(response.statusCode).toBe(200);
    });
  });
});
