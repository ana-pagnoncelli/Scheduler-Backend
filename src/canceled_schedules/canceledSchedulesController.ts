/** source/controllers/posts.ts */
import { Request, Response } from "express";
import {
  CanceledSchedule,
} from "./model";
import { User } from "../users";
import { getCancelScheduleInfo } from "./logic";
import { handleAddOrUpdate } from "./service";
import { checkIfUserExists, increaseClassesToRecover } from "../users/service";

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

export const addOrUpdateCanceledSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const cancelScheduleInfo = getCancelScheduleInfo(request);

    await checkIfUserExists(cancelScheduleInfo.userEmail);

    const canceledScheduleResponse = await handleAddOrUpdate(cancelScheduleInfo);

    await increaseClassesToRecover(cancelScheduleInfo.userEmail);
    
    response.send(canceledScheduleResponse);
    
  } catch (error) {
    response.status(500).send({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
