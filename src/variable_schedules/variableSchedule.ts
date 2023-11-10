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

export const VariableSchedule = mongoose.model(
  "VariableSchedule",
  VariableScheduleSchema
);
