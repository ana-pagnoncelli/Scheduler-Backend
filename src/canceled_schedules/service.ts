import { canceledScheduleUniqueId } from "./logic";
import {
  CanceledSchedule,
  CanceledSchedulesType,
  CancelScheduleInfo
} from "./model";
import { Document } from "mongoose";

export const updateCanceledSchedule = async (
  canceledSchedule: Document & CanceledSchedulesType,
  { scheduleHour, scheduleDay, userEmail }: CancelScheduleInfo
): Promise<CanceledSchedulesType> => {
  let updatedSchedule: CanceledSchedulesType = canceledSchedule;

  if (!canceledSchedule.users_list.includes(userEmail)) {
    await canceledSchedule.updateOne({ $push: { users_list: userEmail } });
    updatedSchedule = (await CanceledSchedule.findOne({
      hour_of_the_day: scheduleHour,
      day: scheduleDay
    })) as CanceledSchedulesType;
  }

  return updatedSchedule;
};

export const addCanceledSchedule = async ({
  scheduleHour,
  scheduleDay,
  userEmail
}: CancelScheduleInfo): Promise<CanceledSchedulesType> => {
  const newCanceledSchedule = new CanceledSchedule({
    id: canceledScheduleUniqueId(scheduleDay, scheduleHour),
    hour_of_the_day: scheduleHour,
    day: scheduleDay,
    users_list: [userEmail]
  });
  await newCanceledSchedule.save();

  return newCanceledSchedule;
};

export const handleAddOrUpdate = async (
  cancelScheduleInfo: CancelScheduleInfo
) => {
  let canceledScheduleResponse: CanceledSchedulesType;

  const canceledSchedule = await CanceledSchedule.findOne({
    hour_of_the_day: cancelScheduleInfo.scheduleHour,
    day: cancelScheduleInfo.scheduleDay
  });

  if (canceledSchedule) {
    canceledScheduleResponse = await updateCanceledSchedule(
      canceledSchedule,
      cancelScheduleInfo
    );
  } else {
    canceledScheduleResponse = await addCanceledSchedule(cancelScheduleInfo);
  }
  return canceledScheduleResponse;
};
