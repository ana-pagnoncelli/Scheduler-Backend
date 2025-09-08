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

// Fixtures for addCanceledSchedule tests
export const addCanceledScheduleData = {
  userEmail: "test@test",
  day: "2023-04-21",
  hour: "19:00"
};

export const addCanceledScheduleData2 = {
  userEmail: "test@test2", 
  day: "2023-04-21",
  hour: "19:00"
};

export const newCanceledScheduleExpected = {
  id: "2023-04-21_19:00",
  day: "2023-04-21",
  hour_of_the_day: "19:00",
  users_list: ["test@test"]
};

export const existingCanceledScheduleExpected = {
  id: "2023-04-21_19:00", 
  day: "2023-04-21", 
  hour_of_the_day: "19:00",
  users_list: ["test@test", "test@test2"]
};