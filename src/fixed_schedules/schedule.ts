import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  week_day: {
    type: String,
    required: true,
    enum: [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY"
    ]
  },
  hour_of_the_day: {
    type: String,
    required: true
  },
  users_list: {
    type: Array
  },
  number_of_spots: {
    type: Number,
    required: true
  }
});

export type ScheduleType = {
  id: string;
  week_day: string;
  hour_of_the_day: string;
  users_list: [];
  number_of_spots: number;
};

export const Schedule = mongoose.model("Schedule", ScheduleSchema);
