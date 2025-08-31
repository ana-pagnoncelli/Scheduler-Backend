import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: 0
  },
  admin: {
    type: Boolean,
    default: false
  },
  phone: {
    type: Number,
    default: 0
  },
  gender: {
    type: String,
    default: ""
  },
  plan: {
    type: String,
    default: ""
  },
  classes_to_recover: {
    type: Number,
    default: 0
  },
  // fixed_schedules can only be added by admin
  fixed_schedules: [
    {
      id: String,
      hour_of_the_day: String,
      week_day: String
    }
  ],
  variable_schedules: [
    {
      id: String,
      hour_of_the_day: String,
      day: String
    }
  ],
  canceled_schedules: [
    {
      id: String,
      hour_of_the_day: String,
      day: String
    }
  ]
});

export const User = mongoose.model("User", UserSchema);

export type UserFixedScheduleType = {
  id: string;
  hour_of_the_day: string;
  week_day: string;
};

export type UserVariableScheduleType = {
  id: string;
  hour_of_the_day: string;
  day: string;
};

export type UserCanceledSchedulesType = {
  id: string;
  hour_of_the_day: string;
  day: string;
};

export type UserType = {
  name: string;
  email: string;
  password: string;
  age: number;
  admin: boolean;
  phone: number;
  fixed_schedules: Array<UserFixedScheduleType>;
  variable_schedules: Array<UserVariableScheduleType>;
  canceled_schedules: Array<UserCanceledSchedulesType>;
};
