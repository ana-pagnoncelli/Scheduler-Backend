import { Request, Response } from "express";
import { VariableSchedule } from "./variableSchedule";
import { User } from "../users";
import { getVariableScheduleInfo } from "./logic";
import { handleAddOrUpdate } from "./service";
import { checkIfUserExists } from "../users/service";

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

export const addUserInVariableSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const { userEmail, scheduleId } = request.params;

    const variableSchedule = new VariableSchedule(
      await VariableSchedule.findOneAndUpdate(
        { id: scheduleId },
        { $push: { users_list: userEmail } },
        {
          new: true
        }
      )
    );

    const userVariableSchedule = {
      id: variableSchedule.id,
      hour_of_the_day: variableSchedule.hour_of_the_day,
      day: variableSchedule.day
    };

    await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { variable_schedules: userVariableSchedule } }
    );

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

    const variableSchedule = new VariableSchedule(
      await VariableSchedule.findOneAndUpdate(
        { id: scheduleId },
        { $pull: { users_list: userEmail } },
        {
          new: true
        }
      )
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
    const variableScheduleInfo = getVariableScheduleInfo(request);
    await checkIfUserExists(variableScheduleInfo.userEmail);
    const variableScheduleResponse = await handleAddOrUpdate(variableScheduleInfo);
    response.status(200).send(variableScheduleResponse);

  } catch (error) {
    response.status(500).send(error);
  }
};
