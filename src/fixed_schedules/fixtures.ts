import { userData, userData2 } from "../users/fixtures";
import { ScheduleType } from "./schedule";

export const scheduleBaseData = {
  id: "1",
  week_day: "MONDAY",
  hour_of_the_day: "18:00",
  number_of_spots: 2
};

export const scheduleData: ScheduleType = {
  ...scheduleBaseData,
  users_list: []
};

export const scheduleDataWithOneUser = {
  ...scheduleBaseData,
  users_list: [userData2.email]
};

export const scheduleWithMissingData = {
  id: "1",
  hour_of_the_day: "18:00",
  users_list: []
};

export const updatedScheduleData = {
  ...scheduleBaseData,
  users_list: [userData.email, userData2.email]
};

export const userDataWithSchedule = {
  ...userData,
  fixed_schedules: [scheduleBaseData]
};

export const userData2WithSchedule = {
  ...userData,
  fixed_schedules: [scheduleBaseData]
};
