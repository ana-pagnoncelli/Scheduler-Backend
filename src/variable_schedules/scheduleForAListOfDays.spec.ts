import request from "supertest";
import { httpServer } from "../setupTests";
import {
  variableScheduleData,
  scheduleData2,
  variableScheduleBaseData2,
  fixedScheduleMonday17,
  fixedScheduleMonday1730,
  variableScheduleMonday18,
  variableScheduleMonday1730,
  variableScheduleMonday17,
  canceledScheduleMonday18,
  canceledScheduleMonday17,
  canceledScheduleMonday1730
} from "./fixtures";
import { scheduleData } from "../fixed_schedules/fixtures";
import { SchedulesReturn, VariableScheduleType } from "./variableSchedule";
import { ScheduleType } from "../fixed_schedules";
import {
  applyFixedSchedules,
  compareCanceledSchedule,
  compareSchedule,
  compareVariableSchedule
} from "./scheduleForAListOfDays";
import { CanceledSchedulesType } from "../canceled_schedules";

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

      const day = "MONDAY";

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

    // it("should apply the variable schedules", () => {
    //   const scheduleMonday17: VariableScheduleType = {
    //     id: "2",
    //     day: "MONDAY",
    //     hour_of_the_day: "17:00",
    //     users_list: ["ana"]
    //   };

    //   const scheduleMonday1730: ScheduleType = {
    //     id: "3",
    //     week_day: "MONDAY",
    //     hour_of_the_day: "17:30",
    //     users_list: [],
    //     number_of_spots: 1
    //   };

    //   const schedules: Array<ScheduleType> = [
    //     scheduleMonday17,
    //     scheduleMonday1730,
    //     scheduleData
    //   ];

    //   const day = "MONDAY";

    //   const scheduleReturn = applyFixedSchedules(schedules, day);

    //   const expectedReturn: SchedulesReturn = {
    //     day,
    //     numberOfSpots: 4,
    //     availableSpots: 3,
    //     hours: [
    //       {
    //         hour: "17:00",
    //         numberOfSpots: 1,
    //         availableSpots: 0
    //       },
    //       {
    //         hour: "17:30",
    //         numberOfSpots: 1,
    //         availableSpots: 1
    //       },
    //       {
    //         hour: "18:00",
    //         numberOfSpots: 2,
    //         availableSpots: 2
    //       }
    //     ]
    //   };
    //   expect(scheduleReturn).toStrictEqual(expectedReturn);
    // });
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
