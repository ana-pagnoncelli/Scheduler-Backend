import mongoose from "mongoose";

const CanceledScheduleSchema = new mongoose.Schema({
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

export const CanceledSchedule = mongoose.model(
  "CanceledSchedule",
  CanceledScheduleSchema
);
