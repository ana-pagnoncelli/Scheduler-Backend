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
  ]
});

export const User = mongoose.model("User", UserSchema);
