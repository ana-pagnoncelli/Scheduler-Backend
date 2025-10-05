import { variableScheduleUniqueId } from "./logic";
import {
  VariableSchedule,
  VariableScheduleType,
  VariableScheduleInfo
} from "./variableSchedule";
import { Document } from "mongoose";

export const updateVariableSchedule = async (
  variableSchedule: Document & VariableScheduleType,
  { scheduleHour, scheduleDay, userEmail }: VariableScheduleInfo
): Promise<VariableScheduleType> => {
  let updatedSchedule: VariableScheduleType = variableSchedule;

  if (!variableSchedule.users_list.includes(userEmail)) {
    await variableSchedule.updateOne({ $push: { users_list: userEmail } });
    updatedSchedule = (await VariableSchedule.findOne({
      hour_of_the_day: scheduleHour,
      day: scheduleDay
    })) as VariableScheduleType;
  }

  return updatedSchedule;
};

export const addVariableSchedule = async ({
  scheduleHour,
  scheduleDay,
  userEmail
}: VariableScheduleInfo): Promise<VariableScheduleType> => {
  const newVariableSchedule = new VariableSchedule({
    id: variableScheduleUniqueId(scheduleDay, scheduleHour),
    hour_of_the_day: scheduleHour,
    day: scheduleDay,
    users_list: [userEmail]
  });
  await newVariableSchedule.save();

  return newVariableSchedule;
};

export const handleAddOrUpdate = async (
  variableScheduleInfo: VariableScheduleInfo
) => {
  let variableScheduleResponse: VariableScheduleType;

  const variableSchedule = await VariableSchedule.findOne({
    hour_of_the_day: variableScheduleInfo.scheduleHour,
    day: variableScheduleInfo.scheduleDay
  });

  if (variableSchedule) {
    variableScheduleResponse = await updateVariableSchedule(
      variableSchedule,
      variableScheduleInfo
    );
  } else {
    variableScheduleResponse = await addVariableSchedule(variableScheduleInfo);
  }
  return variableScheduleResponse;
};
