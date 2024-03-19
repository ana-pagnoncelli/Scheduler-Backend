/** source/controllers/posts.ts */
import { Request, Response } from "express";
import { Plan } from "./plan";

export const addPlan = async (request: Request, response: Response) => {
  try {
    const plan = new Plan(request.body);
    await plan.save();
    response.send(plan);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const getPlans = async (request: Request, response: Response) => {
  try {
    const plans = await Plan.find({});
    response.send(plans);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const getPlan = async (request: Request, response: Response) => {
  try {
    const planId = request.params.id;
    const plan = new Plan(await Plan.findOne({ id: planId }));
    response.status(200).send(plan);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const deletePlan = async (request: Request, response: Response) => {
  try {
    const planId = request.params.id;
    const plan = await Plan.findOneAndDelete({ id: planId });
    response.status(200).send(plan);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const updatePlan = async (request: Request, response: Response) => {
  try {
    const planId = request.params.id;

    if (request.body.id) {
      delete request.body.id;
    }
    const data = { $set: request.body };
    const plan = await Plan.findOneAndUpdate({ id: planId }, data, {
      new: true
    });
    response.status(200).send(plan);
  } catch (error) {
    response.status(500).send(error);
  }
};
