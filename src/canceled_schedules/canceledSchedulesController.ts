/** source/controllers/posts.ts */
import { Request, response, Response } from "express";
import { Document } from "mongoose";
import {
  CanceledSchedule,
  CanceledSchedulesType,
  CancelScheduleInfo
} from "./model";
import { User } from "../users";
import { getCancelScheduleInfo } from "./logic";
import { addCanceledSchedule, handleAddOrUpdate, updateCanceledSchedule } from "./service";
import { checkIfUserExists } from "../users/service";

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

    await checkIfUserExists(cancelScheduleInfo.userEmail);

    const canceledScheduleResponse = await handleAddOrUpdate(cancelScheduleInfo);
    
    response.send(canceledScheduleResponse);
    
  } catch (error) {
    response.status(500).send({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
