import { userData, userData2 } from "../users/fixtures";

const canceledScheduleBaseData = {
  id: "1",
  day: "2023-04-20",
  hour_of_the_day: "18:00"
};

export const canceledScheduleData = {
  ...canceledScheduleBaseData,
  users_list: []
};

export const canceledScheduleDataWithOneUser = {
  ...canceledScheduleBaseData,
  users_list: [userData2.email]
};

export const canceledScheduleWithMissingData = {
  id: "1",
  hour_of_the_day: "18:00",
  users_list: []
};

export const updatedCanceledScheduleData = {
  ...canceledScheduleBaseData,
  users_list: [userData.email, userData2.email]
};

export const userDataWithSchedule = {
  ...userData,
  canceled_schedules: [canceledScheduleBaseData]
};

export const userData2WithSchedule = {
  ...userData,
  canceled_schedules: [canceledScheduleBaseData]
};
