import { CanceledSchedule, CanceledSchedulesType, CancelScheduleInfo } from "./model";
import { Document } from "mongoose";

export const updateCanceledSchedule = async (
    canceledSchedule: Document & CanceledSchedulesType,
    { scheduleHour, scheduleDay, userEmail }: CancelScheduleInfo
  ): Promise<CanceledSchedulesType> => {
  
    let updatedSchedule: CanceledSchedulesType = canceledSchedule;
  
    if (!canceledSchedule.users_list.includes(userEmail)) {
      await canceledSchedule.updateOne({ $push: { users_list: userEmail } });
      updatedSchedule = await CanceledSchedule.findOne({
        hour_of_the_day: scheduleHour,
        day: scheduleDay
      }) as CanceledSchedulesType;
    } 
  
    return updatedSchedule;
  };