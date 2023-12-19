import mongoose from "mongoose";

const VariableScheduleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  day: {
    type: String,
    required: true
  },
  hour_of_the_day: {
    type: String,
    required: true
  },
  users_list: {
    type: Array
  }
});

export type VariableScheduleType = {
  id: string;
  day: string;
  hour_of_the_day: string;
  users_list: [];
};

export const VariableSchedule = mongoose.model(
  "VariableSchedule",
  VariableScheduleSchema
);

export type Hour = {
  hour: string;
  numberOfSpots: number;
  availableSpots: number;
};

export type SchedulesReturn = {
  day: string;
  numberOfSpots: number;
  availableSpots: number;
  hours: Hour[];
};
