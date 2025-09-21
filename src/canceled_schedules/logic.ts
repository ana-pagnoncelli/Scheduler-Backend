import { CancelScheduleInfo } from "./model";

export const getCancelScheduleInfo = (request: any): CancelScheduleInfo => {
  const scheduleHour = request.body.hour;
  const scheduleDay = request.body.day;
  const userEmail = request.body.userEmail;

  return { scheduleHour, scheduleDay, userEmail };
};

export const canceledScheduleUniqueId = (scheduleDay: string, scheduleHour: string) => {
  return `${scheduleDay}_${scheduleHour}`;
};
