/** source/controllers/posts.ts */
import { Request, Response } from "express";
import { Document } from "mongoose";
import { CanceledSchedule, CanceledSchedulesType, CancelScheduleInfo } from "./model";
import { User } from "../users";
import { getCancelScheduleInfo } from "./logic";
import { addCanceledSchedule, updateCanceledSchedule } from "./service";

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
      const newCanceledSchedule = await addCanceledSchedule(cancelScheduleInfo);
      response.send(newCanceledSchedule);
    }
  } catch (error) {
    response.status(500).send(error);
  }
};
