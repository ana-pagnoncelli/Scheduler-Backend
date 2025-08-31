import moment from "moment";
import { WeekDay } from "../fixed_schedules/schedule";

type DateWithWeekDay = {
  week_day: WeekDay;
  date: string;
};

const weekday = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
] as WeekDay[];

export function getWeekDay(date: Date): WeekDay {
  return weekday[date.getDay()];
}

export function stringToDate(dateString: string): Date {
  return new Date(dateString);
}

export function numberOfDaysBetweenDates(
  startDate: string,
  endDate: string
): number {
  let start = moment(startDate);
  let end = moment(endDate);
  return end.diff(start, "days");
}

export function findNearestDate(
  pointOfReference: string,
  listOfDates: string[]
): string | undefined {
  let nearestDate: string | undefined;
  let minDiff: number = Infinity;

  listOfDates.forEach((date) => {
    const diff = moment(date).diff(moment(pointOfReference), "days");
    if (diff >= 0) {
      if (nearestDate) {
        if (diff < minDiff) {
          nearestDate = date;
          minDiff = diff;
        }
      } else {
        nearestDate = date;
        minDiff = diff;
      }
    }
  });

  return nearestDate;
}

export function findClosestWeekDay(
  referenceWeekDay: WeekDay,
  weekDays: WeekDay[]
): { weekDay: WeekDay | undefined; diff: number } {
  if (weekDays.length === 0) {
    return { weekDay: undefined, diff: 0 };
  }

  let closestWeekDay: WeekDay | undefined;
  let minDiff = Infinity;

  const currentIndex = weekday.indexOf(referenceWeekDay);

  weekDays.forEach((weekDay) => {
    const targetIndex = weekday.indexOf(weekDay);

    let diff = 0;

    if (currentIndex === targetIndex) {
      // Same weekday, difference is 0
      diff = 0;
    } else if (currentIndex < targetIndex) {
      // Target weekday is later in the week
      diff = targetIndex - currentIndex;
    } else {
      // Target weekday is earlier in the week, so we go to next week
      diff = 7 - currentIndex + targetIndex;
    }

    // Check if this is the closest weekday so far
    if (diff < minDiff) {
      minDiff = diff;
      closestWeekDay = weekDay;
    }
  });

  return { weekDay: closestWeekDay, diff: minDiff };
}

export function getCurrentDate(date: Date, separator = ""): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${day < 10 ? `0${day}` : `${day}`}`;
}

export function dateWithWeekDayForNext7Days(): DateWithWeekDay[] {
  const dates = [];
  const currentDate = new Date();
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);

    dates.push({
      week_day: getWeekDay(date),
      date: getCurrentDate(date, "-")
    } as DateWithWeekDay);
  }
  return dates;
}

export function weekdaysToDates(
  referenceDate: string,
  weekDays: WeekDay[]
): string[] {
  if (weekDays.length === 0) {
    return [];
  }

  const dates: string[] = [];
  const dateAsMoment = moment(referenceDate);
  const referenceIndex = dateAsMoment.weekday();

  weekDays.forEach((targetWeekDay) => {
    const targetIndex = weekday.indexOf(targetWeekDay);
    let daysToAdd = 0;

    if (referenceIndex === targetIndex) {
      // Same weekday, use reference date
      daysToAdd = 0;
    } else if (referenceIndex < targetIndex) {
      // Target weekday is later in the same week
      daysToAdd = targetIndex - referenceIndex;
    } else {
      // Target weekday is earlier in the week, go to next week
      daysToAdd = 7 - referenceIndex + targetIndex;
    }

    const targetDate = dateAsMoment.clone().add(daysToAdd, "days");
    dates.push(targetDate.format("YYYY-MM-DD"));
  });

  return dates;
}

export function removeDatesFromList(
  dates: string[],
  datesToRemove: string[]
): string[] {
  return dates.filter((date) => !datesToRemove.includes(date));
}

export function mergeDateLists(
  dates: string[],
  variableSchedulesDates: string[],
  canceledSchedulesDates: string[]
): string[] {
  return removeDatesFromList(
    [...dates, ...variableSchedulesDates],
    canceledSchedulesDates
  );
}
