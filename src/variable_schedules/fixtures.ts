import { userData, userData2 } from "../users/fixtures";

const variableScheduleBaseData = {
  id: "1",
  day: "2023-04-20",
  hour_of_the_day: "18:00"
};

export const variableScheduleData = {
  ...variableScheduleBaseData,
  users_list: []
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
