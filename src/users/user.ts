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
  }
});

export const User = mongoose.model("User", UserSchema);
