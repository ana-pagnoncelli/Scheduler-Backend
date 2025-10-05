import { VariableScheduleInfo } from "./variableSchedule";

export const getVariableScheduleInfo = (request: any): VariableScheduleInfo => {
    const scheduleHour = request.body.hour;
    const scheduleDay = request.body.day;
    const userEmail = request.body.userEmail;
  
    return { scheduleHour, scheduleDay, userEmail };
  };
  
  export const variableScheduleUniqueId = (scheduleDay: string, scheduleHour: string) => {
    return `${scheduleDay}_${scheduleHour}`;
  };