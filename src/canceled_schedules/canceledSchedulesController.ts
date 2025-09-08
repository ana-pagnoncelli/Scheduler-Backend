/** source/controllers/posts.ts */
import { Request, Response } from "express";
import { CanceledSchedule } from "./canceledSchedule";
import { User } from "../users";

export const updateCanceledSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const scheduleId = request.params.id;
    const data = { $set: request.body };
    const canceledSchedule = await CanceledSchedule.findOneAndUpdate(
      { id: scheduleId },
      data,
      {
        new: true
      }
    );
    response.status(200).send(canceledSchedule);
  } catch (error) {
    response.status(500).send(error);
  }
};

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

export const addUserInCanceledSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const { userEmail, scheduleId } = request.params;

    // First check if the user is already in the schedule
    const existingSchedule = await CanceledSchedule.findOne({ id: scheduleId });
    if (existingSchedule && existingSchedule.users_list.includes(userEmail)) {
      return response.status(200).send(existingSchedule);
    }

    const canceledSchedule = new CanceledSchedule(
      await CanceledSchedule.findOneAndUpdate(
        { id: scheduleId },
        { $push: { users_list: userEmail } },
        {
          new: true
        }
      )
    );

    // Check if user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return response.status(500).send({ error: "User not found" });
    }

    const userCanceledSchedule = {
      id: canceledSchedule.id,
      hour_of_the_day: canceledSchedule.hour_of_the_day,
      day: canceledSchedule.day
    };

    // Check if user already has this canceled schedule
    const userHasSchedule = user.canceled_schedules.some(
      (schedule: any) => schedule.id === canceledSchedule.id
    );

    if (!userHasSchedule) {
      await User.findOneAndUpdate(
        { email: userEmail },
        { $push: { canceled_schedules: userCanceledSchedule } }
      );
    }

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

export const addCanceledSchedule = async (
  request: Request,
  response: Response
) => {
  try {
    const scheduleHour = request.body.hour;
    const scheduleDay = request.body.day;
    const userEmail = request.body.userEmail;

    // Check if user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return response.status(500).send({ error: "User not found" });
    }

    const canceledSchedule = await CanceledSchedule.findOne({
      hour_of_the_day: scheduleHour,
      day: scheduleDay
    });

    if (canceledSchedule) {
      // Only add user if they're not already in the list
      if (!canceledSchedule.users_list.includes(userEmail)) {
        await canceledSchedule.updateOne({ $push: { users_list: userEmail } });
      }
      const updatedSchedule = await CanceledSchedule.findOne({
        hour_of_the_day: scheduleHour,
        day: scheduleDay
      });
      response.send(updatedSchedule);
    } else {
      const newCanceledSchedule = new CanceledSchedule({
        id: `${scheduleDay}_${scheduleHour}`,
        hour_of_the_day: scheduleHour,
        day: scheduleDay,
        users_list: [userEmail]
      });
      await newCanceledSchedule.save();
      response.send(newCanceledSchedule);
    }
  } catch (error) {
    response.status(500).send(error);
  }
};
