import { UserType } from "./user";
import {
  findNearestDate,
  mergeDateLists,
  weekdaysToDates
} from "../utils/date";
import { WeekDay } from "../fixed_schedules/schedule";
import { NO_CLASS_SCHEDULED_FOR_USER } from "../utils/constants";

export const nextClass = (referenceDate: string, user: UserType): string => {
  const weekDays: WeekDay[] = user.fixed_schedules.map(
    (schedule) => schedule.week_day.toUpperCase() as WeekDay
  );

  const weekDaysDates = weekdaysToDates(referenceDate, weekDays);
  console.log("weekDaysDates", weekDaysDates);
  const canceledSchedulesDates = user.canceled_schedules.map(
    (schedule) => schedule.day
  );
  const variableSchedulesDates = user.variable_schedules.map(
    (schedule) => schedule.day
  );

  const mergedDates = mergeDateLists(
    weekDaysDates,
    variableSchedulesDates,
    canceledSchedulesDates
  );

  const nearestDate = findNearestDate(referenceDate, mergedDates);
  if (!nearestDate) {
    return NO_CLASS_SCHEDULED_FOR_USER;
  }
  return nearestDate;
};
