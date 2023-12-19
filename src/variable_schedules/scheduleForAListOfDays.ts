/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

/** source/controllers/posts.ts */
import { Request, Response } from "express";
import {
  SchedulesReturn,
  VariableSchedule,
  VariableScheduleType
} from "./variableSchedule";
import { Schedule, ScheduleType } from "../fixed_schedules";
import { CanceledSchedule, CanceledSchedulesType } from "../canceled_schedules";

const applyFixedSchedules = (
  fixedSchedules: Array<ScheduleType>,
  day: string
): SchedulesReturn => {
  const scheduleReturn: SchedulesReturn = {
    day,
    numberOfSpots: 0,
    availableSpots: 0,
    hours: []
  };

  fixedSchedules.forEach((fixedSchedule) => {
    scheduleReturn.numberOfSpots += fixedSchedule.number_of_spots;
    scheduleReturn.availableSpots +=
      fixedSchedule.number_of_spots - fixedSchedule.users_list.length;

    scheduleReturn.hours.push({
      hour: fixedSchedule.hour_of_the_day,
      numberOfSpots: fixedSchedule.number_of_spots,
      availableSpots: fixedSchedule.number_of_spots
    });
  });

  return scheduleReturn;
};

const applyCanceledSchedules = (
  canceledSchedules: Array<CanceledSchedulesType>,
  scheduleReturn: SchedulesReturn
): SchedulesReturn => {
  const newScheduleReturn = scheduleReturn;
  newScheduleReturn.hours = [];
  let i = 0;

  scheduleReturn.hours.forEach((hour) => {
    if (
      canceledSchedules.length > i &&
      hour.hour === canceledSchedules[i].hour_of_the_day
    ) {
      newScheduleReturn.availableSpots +=
        canceledSchedules[i].users_list.length;

      newScheduleReturn.hours.push({
        hour: hour.hour,
        numberOfSpots: scheduleReturn.numberOfSpots,
        availableSpots:
          scheduleReturn.availableSpots + canceledSchedules[i].users_list.length
      });
    } else {
      i += 1;
    }
  });

  return newScheduleReturn;
};

const applyVariableSchedules = (
  variableSchedules: Array<VariableScheduleType>,
  scheduleReturn: SchedulesReturn
): SchedulesReturn => {
  const newScheduleReturn = scheduleReturn;
  newScheduleReturn.hours = [];
  let i = 0;

  scheduleReturn.hours.forEach((hour) => {
    if (
      variableSchedules.length > i &&
      hour.hour === variableSchedules[i].hour_of_the_day
    ) {
      newScheduleReturn.availableSpots +=
        variableSchedules[i].users_list.length;

      newScheduleReturn.hours.push({
        hour: hour.hour,
        numberOfSpots: scheduleReturn.numberOfSpots,
        availableSpots:
          scheduleReturn.availableSpots + variableSchedules[i].users_list.length
      });
    } else {
      i += 1;
    }
  });

  return newScheduleReturn;
};

export function compareSchedule(a: ScheduleType, b: ScheduleType) {
  if (a.hour_of_the_day < b.hour_of_the_day) {
    return -1;
  }
  if (a.hour_of_the_day > b.hour_of_the_day) {
    return 1;
  }
  return 0;
}

export function compareVariableSchedule(
  a: VariableScheduleType,
  b: VariableScheduleType
) {
  if (a.hour_of_the_day < b.hour_of_the_day) {
    return -1;
  }
  if (a.hour_of_the_day > b.hour_of_the_day) {
    return 1;
  }
  return 0;
}

export function compareCanceledSchedule(
  a: CanceledSchedulesType,
  b: CanceledSchedulesType
) {
  if (a.hour_of_the_day < b.hour_of_the_day) {
    return -1;
  }
  if (a.hour_of_the_day > b.hour_of_the_day) {
    return 1;
  }
  return 0;
}

const getFixedSchedules = async (weekDay: string) => {
  const fixedSchedules = (await Schedule.find({
    week_day: weekDay
  })) as Array<ScheduleType>;

  if (fixedSchedules) fixedSchedules.sort(compareSchedule);

  return fixedSchedules;
};

const getCanceledSchedules = async (date: string) => {
  const canceledSchedules = (await CanceledSchedule.find({
    day: date
  })) as Array<CanceledSchedulesType>;

  if (canceledSchedules) canceledSchedules.sort(compareCanceledSchedule);

  return canceledSchedules;
};

const getVariableSchedules = async (date: string) => {
  const variableSchedule = (await VariableSchedule.find({
    day: date
  })) as Array<VariableScheduleType>;

  if (variableSchedule) variableSchedule.sort(compareVariableSchedule);

  return variableSchedule;
};

const joinSchedules = (
  date: string,
  fixedSchedules: Array<ScheduleType>,
  canceledSchedules: Array<CanceledSchedulesType>,
  variableSchedule: Array<VariableScheduleType>
) => {
  const schedulesAfterApplyFixed: SchedulesReturn = applyFixedSchedules(
    fixedSchedules,
    date
  );

  console.log(schedulesAfterApplyFixed);

  const schedulesAfterApplyCanceled: SchedulesReturn = applyCanceledSchedules(
    canceledSchedules,
    schedulesAfterApplyFixed
  );

  console.log(fixedSchedules);

  const schedulesAfterApplyVariable: SchedulesReturn = applyVariableSchedules(
    variableSchedule,
    schedulesAfterApplyCanceled
  );

  return schedulesAfterApplyVariable;
};

export const getSchedulesForAListOfDays = async (
  // receives a list of objects [{week-day date}]
  request: Request,
  response: Response
) => {
  try {
    const listOfDays = request.body;
    const scheduleReturn = [];

    for (const day of listOfDays) {
      console.log("day", day);

      const fixedSchedules = await getFixedSchedules(day.week_day);

      console.log("fixed schedule", fixedSchedules);

      const variableSchedule = await getVariableSchedules(day.date);

      console.log("variable schedule", variableSchedule);

      const canceledSchedules = await getCanceledSchedules(day.date);

      console.log("canceled schedule", canceledSchedules);

      const joinedSchedules = joinSchedules(
        day.date,
        fixedSchedules,
        canceledSchedules,
        variableSchedule
      );

      console.log(joinedSchedules);

      scheduleReturn.push(joinedSchedules);
    }

    response.status(200).send(scheduleReturn);
  } catch (error) {
    response.status(500).send(error);
  }
};
