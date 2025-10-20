import { Request, Response } from "express";
import { VariableSchedule } from "./model";
import { User } from "../users";
import { getVariableScheduleInfo } from "./logic";
import { handleAddOrUpdate } from "./service";
import { checkIfUserExists, decreaseClassesToRecover } from "../users/service";
import { userWasInCanceledSchedule } from "../canceled_schedules/service";

export const updateVariableSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const scheduleId = request.params.id;
    const data = { $set: request.body };
    const variableSchedule = await VariableSchedule.findOneAndUpdate(
      { id: scheduleId },
      data,
      {
        new: true
      }
    );
    response.status(200).send(variableSchedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const deleteVariableSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const scheduleId = request.params.id;
    const variableSchedule = await VariableSchedule.findOneAndDelete({
      id: scheduleId
    });
    response.status(200).send(variableSchedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const getVariableSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const scheduleId = request.params.id;
    const variableSchedule = await VariableSchedule.findOne({ id: scheduleId });
    response.status(200).send(variableSchedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const removeUserFromVariableSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const { userEmail, scheduleId } = request.params;

    const variableSchedule = await VariableSchedule.findOneAndUpdate(
      { id: scheduleId },
      { $pull: { users_list: userEmail } },
      {
        new: true
      }
    );

    await User.findOneAndUpdate(
      { email: userEmail },
      { $pull: { variable_schedules: { id: { $in: scheduleId } } } }
    );

    response.status(200).send(variableSchedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const addOrUpdateVariableSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    let message = "";
    const variableScheduleInfo = getVariableScheduleInfo(request);
    await checkIfUserExists(variableScheduleInfo.userEmail);

    if (await userWasInCanceledSchedule(variableScheduleInfo)) {
      message = "User was removed from canceled schedule";
    } else {
      await handleAddOrUpdate(variableScheduleInfo);
      message = "Variable schedule added or updated";
    }
    
    await decreaseClassesToRecover(variableScheduleInfo.userEmail);
    response.status(200).send(message);

  } catch (error) {
    response.status(500).send(error);
  }
};
