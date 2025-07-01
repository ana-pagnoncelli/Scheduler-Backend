/* eslint-disable no-param-reassign */
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

export const applyFixedSchedules = (
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
    const numberOfUsers = fixedSchedule.users_list.length;
    const availableSpots = fixedSchedule.number_of_spots - numberOfUsers;

    scheduleReturn.numberOfSpots += fixedSchedule.number_of_spots;
    scheduleReturn.availableSpots +=
      fixedSchedule.number_of_spots - numberOfUsers;

    scheduleReturn.hours.push({
      hour: fixedSchedule.hour_of_the_day,
      numberOfSpots: fixedSchedule.number_of_spots,
      availableSpots
    });
  });

  return scheduleReturn;
};

export const applyCanceledSchedules = (
  canceledSchedules: Array<CanceledSchedulesType>,
  scheduleReturn: SchedulesReturn
): SchedulesReturn => {
  scheduleReturn.hours.forEach((hour) => {
    canceledSchedules.forEach((canceledSchedule) => {
      if (hour.hour === canceledSchedule.hour_of_the_day) {
        const numberOfUsers = canceledSchedule.users_list.length;
        scheduleReturn.availableSpots += numberOfUsers;

        hour.availableSpots += numberOfUsers;
      }
    });
  });

  return scheduleReturn;
};

export const applyVariableSchedules = (
  variableSchedules: Array<VariableScheduleType>,
  scheduleReturn: SchedulesReturn
): SchedulesReturn => {
  scheduleReturn.hours.forEach((hour) => {
    variableSchedules.forEach((variableSchedule) => {
      if (hour.hour === variableSchedule.hour_of_the_day) {
        const numberOfUsers = variableSchedule.users_list.length;
        scheduleReturn.availableSpots -= numberOfUsers;

        hour.availableSpots -= numberOfUsers;
      }
    });
  });

  return scheduleReturn;
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

  const schedulesAfterApplyVariable: SchedulesReturn = applyVariableSchedules(
    variableSchedule,
    schedulesAfterApplyFixed
  );

  const schedulesAfterApplyCanceled: SchedulesReturn = applyCanceledSchedules(
    canceledSchedules,
    schedulesAfterApplyVariable
  );

  return schedulesAfterApplyCanceled;
};

export const getSchedulesForAListOfDays = async (
  // receives a list of objects [{week-day date}]
  request: Request,
  response: Response
) => {
  try {
    const listOfDays = request.body;
    console.log(listOfDays);
    const scheduleReturn = [];

    for (const day of listOfDays) {
      const fixedSchedules = await getFixedSchedules(day.week_day);

      const variableSchedule = await getVariableSchedules(day.date);

      const canceledSchedules = await getCanceledSchedules(day.date);

      const joinedSchedules = joinSchedules(
        day.date,
        fixedSchedules,
        canceledSchedules,
        variableSchedule
      );

      scheduleReturn.push(joinedSchedules);
    }

    response.status(200).send(scheduleReturn);
  } catch (error) {
    response.status(500).send(error);
  }
};
