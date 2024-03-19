import { v4 as uuid } from "uuid";

export const planData = {
  id: uuid(),
  name: "2x per week / monthly payment",
  price: 250,
  description:
    "2 classes per week, totalizing 8 classes in a month. The payment is every month",
  number_of_classes: 8,
  classes_per_week: 2
};

export const planData2 = {
  id: uuid(),
  name: "1x per week / quarterly payment",
  price: 100,
  description:
    "1 class per week, totalizing 12 classes. The payment is every 3 months",
  number_of_classes: 12,
  classes_per_week: 1
};

export const updatedPlanData = {
  ...planData,
  name: "2x per week / quarterly payment"
};

export const planDataWithMissingName = {
  id: uuid(),
  price: 100,
  description:
    "1 class per week, totalizing 12 classes. The payment is every 3 months",
  number_of_classes: 12,
  classes_per_week: 1
};
