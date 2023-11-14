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
  hourOfTheDay: string;
  usersList: [];
};

export const VariableSchedule = mongoose.model(
  "VariableSchedule",
  VariableScheduleSchema
);
