/** source/controllers/posts.ts */
import { Request, Response } from "express";
import { Schedule } from "./schedule";
import { User } from "../users";

export const addSchedule = async (request: Request, response: Response) => {
  try {
    const schedule = new Schedule(request.body);
    await schedule.save();
    response.send(schedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const updateSchedule = async (request: Request, response: Response) => {
  try {
    const scheduleId = request.params.id;
    const data = { $set: request.body };
    const schedule = await Schedule.findOneAndUpdate({ id: scheduleId }, data, {
      new: true
    });
    response.status(200).send(schedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const deleteSchedule = async (request: Request, response: Response) => {
  try {
    const scheduleId = request.params.id;
    const schedule = await Schedule.findOneAndDelete({ id: scheduleId });
    response.status(200).send(schedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const getSchedule = async (request: Request, response: Response) => {
  try {
    const scheduleId = request.params.id;
    const schedule = await Schedule.findOne({ id: scheduleId });
    response.status(200).send(schedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const addUserInSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const { userEmail, scheduleId } = request.params;

    const schedule = new Schedule(
      await Schedule.findOneAndUpdate(
        { id: scheduleId },
        { $push: { users_list: userEmail } },
        {
          new: true
        }
      )
    );

    const userSchedule = {
      id: schedule.id,
      hour_of_the_day: schedule.hour_of_the_day,
      week_day: schedule.week_day
    };

    await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { fixed_schedules: userSchedule } }
    );

    response.status(200).send(schedule);
  } catch (error) {
    response.status(500).send(error);
  }
};
