/** source/controllers/posts.ts */
import { Request, Response } from "express";
import { VariableSchedule, VariableScheduleType } from "./variableSchedule";
import { User } from "../users";
import { Schedule, ScheduleType } from "../fixed_schedules";
import { CanceledSchedule, CanceledSchedulesType } from "../canceled_schedules";

export const addVariableSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const variableSchedule = new VariableSchedule(request.body);
    await variableSchedule.save();
    response.send(variableSchedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

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

type Hour = {
  hour: string;
  numberOfSpots: number;
  availableSpots: number;
};

type SchedulesReturn = {
  day: string;
  numberOfSpots: number;
  availableSpots: number;
  hours: Hour[];
};

const applyFixedSchedules = (
  fixedSchedules: Array<ScheduleType>,
  day: string
): SchedulesReturn => {
  const scheduleReturn: SchedulesReturn = {
    day,
    numberOfSpots: 0,
    availableSpots: 0,
    hours: []
  };

  fixedSchedules.forEach((fixedSchedule) => {
    scheduleReturn.numberOfSpots += fixedSchedule.numberOfSpots;
    scheduleReturn.availableSpots +=
      fixedSchedule.numberOfSpots - fixedSchedule.usersList.length;

    scheduleReturn.hours.push({
      hour: fixedSchedule.hourOfTheDay,
      numberOfSpots: fixedSchedule.numberOfSpots,
      availableSpots: fixedSchedule.numberOfSpots
    });
  });

  return scheduleReturn;
};

const applyCanceledSchedules = (
  canceledSchedules: Array<CanceledSchedulesType>,
  scheduleReturn: SchedulesReturn
): SchedulesReturn => {
  const newScheduleReturn = scheduleReturn;
  newScheduleReturn.hours = [];
  let i = 0;

  scheduleReturn.hours.forEach((hour) => {
    if (
      canceledSchedules.length > i &&
      hour.hour === canceledSchedules[i].hourOfTheDay
    ) {
      newScheduleReturn.availableSpots += canceledSchedules[i].usersList.length;

      newScheduleReturn.hours.push({
        hour: hour.hour,
        numberOfSpots: scheduleReturn.numberOfSpots,
        availableSpots:
          scheduleReturn.availableSpots + canceledSchedules[i].usersList.length
      });
    } else {
      i += 1;
    }
  });

  return newScheduleReturn;
};

export const getSchedulesForAListOfDays = async (
  // receives a list of objects [{week-day date}]
  request: Request,
  response: Response
) => {
  try {
    const listOfDays = request.body;

    listOfDays.forEach(async (day: { week_day: string; date: string }) => {
      // need to order by time
      const fixedSchedules = (await Schedule.find({
        week_day: day.week_day
      })) as Array<ScheduleType>;

      // need to order by time
      const canceledSchedules = (await CanceledSchedule.find({
        day: day.date
      })) as Array<CanceledSchedulesType>;

      // need to order by time
      const variableSchedule = (await VariableSchedule.findOne({
        day: day.date
      })) as Array<VariableScheduleType>;

      const schedulesAfterApplyFixed: GetSchedulesReturn = applyFixedSchedules(
        fixedSchedules,
        day.date
      );
    });

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
