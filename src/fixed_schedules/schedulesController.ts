/** source/controllers/posts.ts */
import { Request, Response } from "express";
import { Schedule } from "./schedule";

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
