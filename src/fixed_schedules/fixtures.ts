import { userData, userData2 } from "../users/fixtures";

const scheduleBaseData = {
  id: "1",
  week_day: "MONDAY",
  hour_of_the_day: "18:00"
};

export const scheduleData = {
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
  users_list: [userData2.email, userData.email]
};

export const userDataWithSchedule = {
  name: "Test",
  email: "test@test",
  password: "test123",
  age: 32,
  fixed_schedules: [scheduleBaseData]
};
