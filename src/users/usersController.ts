/** source/controllers/posts.ts */
import { Request, Response } from "express";
import { User, UserType } from "./user";

export const addUser = async (request: Request, response: Response) => {
  try {
    const user = new User(request.body);
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const getUsers = async (request: Request, response: Response) => {
  try {
    const users = await User.find({});
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const getUser = async (request: Request, response: Response) => {
  try {
    const userEmail = request.params.email;
    const user = new User(await User.findOne({ email: userEmail }));
    response.status(200).send(user);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const deleteUser = async (request: Request, response: Response) => {
  try {
    const userEmail = request.params.email;
    const user = await User.findOneAndDelete({ email: userEmail });
    response.status(200).send(user);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const updateUser = async (request: Request, response: Response) => {
  try {
    const userEmail = request.params.email;

    if (request.body.email) {
      delete request.body.email;
    }
    const data = { $set: request.body };
    const user = await User.findOneAndUpdate({ email: userEmail }, data, {
      new: true
    });
    response.status(200).send(user);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const login = async (request: Request, response: Response) => {
  try {
    const requestUser = new User(request.body);
    const databaseUser = new User(
      await User.findOne({ email: requestUser.email })
    );
    if (databaseUser && requestUser.password === databaseUser.password) {
      response.status(200).send(databaseUser);
    } else {
      response.status(401).send();
    }
  } catch (error) {
    response.status(500).send(error);
  }
};

export const nextClass = async (weekDay: string, date: string, user: UserType) => {
  
};

export const myScheduleInfo = async (
  // receives an object {week-day date}
  request: Request,
  response: Response
) => {
  try {
    const userEmail = request.params.email;
    const user = new User(await User.findOne({ email: userEmail }));
    let fixedSchedulesDays: Array<string> = [];

    user.fixed_schedules.forEach((schedule) => {
      fixedSchedulesDays.push(schedule.week_day + " " + schedule.hour_of_the_day);
    });

    const mySchedule = {
      nextClass: "2025-08-25 10:00",
      numberOfClassesToRecover: 2,
      fixedSchedulesDays: fixedSchedulesDays
    };
    response.status(200).send(mySchedule);
  } catch (error) {
    response.status(500).send(error);
  }
};
