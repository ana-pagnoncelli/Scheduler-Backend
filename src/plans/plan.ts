import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  classes_per_week: {
    type: Number,
    required: true
  }
});

export const Plan = mongoose.model("Plan", PlanSchema);
