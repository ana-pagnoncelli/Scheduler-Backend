/** source/controllers/posts.ts */
import { Request, Response } from "express";
import { Document } from "mongoose";
import { CanceledSchedule, CanceledSchedulesType, CancelScheduleInfo } from "./canceledSchedule";
import { User } from "../users";
import { getCancelScheduleInfo } from "./logic";

export const deleteCanceledSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const scheduleId = request.params.id;
    const canceledSchedule = await CanceledSchedule.findOneAndDelete({
      id: scheduleId
    });
    response.status(200).send(canceledSchedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const getCanceledSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const scheduleId = request.params.id;
    const canceledSchedule = await CanceledSchedule.findOne({ id: scheduleId });
    response.status(200).send(canceledSchedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const removeUserFromCanceledSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const { userEmail, scheduleId } = request.params;

    const canceledSchedule = new CanceledSchedule(
      await CanceledSchedule.findOneAndUpdate(
        { id: scheduleId },
        { $pull: { users_list: userEmail } },
        {
          new: true
        }
      )
    );

    await User.findOneAndUpdate(
      { email: userEmail },
      { $pull: { canceled_schedules: { id: { $in: scheduleId } } } }
    );

    response.status(200).send(canceledSchedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

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

export const addOrUpdateCanceledSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const cancelScheduleInfo = getCancelScheduleInfo(request);

    // Check if user exists
    const user = await User.findOne({ email: cancelScheduleInfo.userEmail });
    if (!user) {
      return response.status(500).send({ error: "User not found" });
    }

    const canceledSchedule = await CanceledSchedule.findOne({
      hour_of_the_day: cancelScheduleInfo.scheduleHour,
      day: cancelScheduleInfo.scheduleDay
    });

    if (canceledSchedule) {
      const updatedCanceledSchedule = await updateCanceledSchedule(canceledSchedule, cancelScheduleInfo);
      response.send(updatedCanceledSchedule);
    } else {
      const newCanceledSchedule = new CanceledSchedule({
        id: `${cancelScheduleInfo.scheduleDay}_${cancelScheduleInfo.scheduleHour}`,
        hour_of_the_day: cancelScheduleInfo.scheduleHour,
        day: cancelScheduleInfo.scheduleDay,
        users_list: [cancelScheduleInfo.userEmail]
      });
      await newCanceledSchedule.save();
      response.send(newCanceledSchedule);
    }
  } catch (error) {
    response.status(500).send(error);
  }
};
