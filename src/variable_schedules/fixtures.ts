import { CanceledSchedulesType } from "../canceled_schedules";
import { ScheduleType } from "../fixed_schedules";
import { userData, userData2 } from "../users/fixtures";
import { VariableScheduleType } from "./variableSchedule";

const variableScheduleBaseData = {
  id: "1",
  day: "2023-04-20",
  hour_of_the_day: "18:00"
};

export const variableScheduleData = {
  ...variableScheduleBaseData,
  users_list: []
};

export const variableScheduleBaseData2 = {
  id: "2",
  day: "2023-04-21",
  hour_of_the_day: "15:00",
  users_list: userData2.email
};

export const variableScheduleDataWithOneUser = {
  ...variableScheduleBaseData,
  users_list: [userData2.email]
};

export const variableScheduleWithMissingData = {
  id: "1",
  hour_of_the_day: "18:00",
  users_list: []
};

export const updatedVariableScheduleData = {
  ...variableScheduleBaseData,
  users_list: [userData.email, userData2.email]
};

export const userDataWithSchedule = {
  ...userData,
  variable_schedules: [variableScheduleBaseData]
};

export const userData2WithSchedule = {
  ...userData,
  variable_schedules: [variableScheduleBaseData]
};

export const scheduleData2 = {
  id: "2",
  week_day: "TUESDAY",
  hour_of_the_day: "11:00",
  number_of_spots: 2,
  users_list: [userData.email]
};

export const fixedScheduleMonday17: ScheduleType = {
  id: "2",
  week_day: "MONDAY",
  hour_of_the_day: "17:00",
  users_list: ["ana"],
  number_of_spots: 1
};

export const fixedScheduleMonday1730: ScheduleType = {
  id: "3",
  week_day: "MONDAY",
  hour_of_the_day: "17:30",
  users_list: [],
  number_of_spots: 1
};

export const variableScheduleMonday18: VariableScheduleType = {
  id: "1",
  day: "2023-02-03",
  hour_of_the_day: "18:00",
  users_list: []
};

export const variableScheduleMonday17: VariableScheduleType = {
  id: "2",
  day: "2023-02-03",
  hour_of_the_day: "17:00",
  users_list: []
};

export const variableScheduleMonday1730: VariableScheduleType = {
  id: "3",
  day: "2023-02-03",
  hour_of_the_day: "17:30",
  users_list: []
};

export const canceledScheduleMonday18: CanceledSchedulesType = {
  id: "1",
  day: "2023-02-03",
  hour_of_the_day: "18:00",
  users_list: []
};

export const canceledScheduleMonday17: CanceledSchedulesType = {
  id: "2",
  day: "2023-02-03",
  hour_of_the_day: "17:00",
  users_list: []
};

export const canceledScheduleMonday1730: CanceledSchedulesType = {
  id: "3",
  day: "2023-02-03",
  hour_of_the_day: "17:30",
  users_list: []
};
