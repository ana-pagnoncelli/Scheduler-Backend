import { UserType } from "./user";
import { findNearestDate, mergeDateLists, weekdaysToDates } from "../utils/date";
import { WeekDay } from "../fixed_schedules/schedule";

export const nextClass = (referenceDate: string, user: UserType) => {
  const weekDays : WeekDay[] = user.fixed_schedules.map((schedule) => schedule.week_day as WeekDay);

  const weekDaysDates = weekdaysToDates(referenceDate, weekDays);
  const canceledSchedulesDates = user.canceled_schedules.map((schedule) => schedule.day);
  const variableSchedulesDates = user.variable_schedules.map((schedule) => schedule.day);

  const mergedDates = mergeDateLists(weekDaysDates, variableSchedulesDates, canceledSchedulesDates);

  return findNearestDate(referenceDate, mergedDates);
};
