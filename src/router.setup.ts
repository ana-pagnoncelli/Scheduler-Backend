import express, { Express } from "express";
import morgan from "morgan";
import { userRouter } from "./users";
import { variableScheduleRouter } from "./variable_schedules";
import { scheduleRouter } from "./fixed_schedules";
import { canceledScheduleRouter } from "./canceled_schedules";
import { planRouter } from "./plans";

export const router: Express = express();

/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** API RULES */
router.use((req, res, next) => {
  // set the CORS policy
  res.header("Access-Control-Allow-Origin", "*");
  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
});

/** Routes */
router.use("/users", userRouter);
router.use("/plans", planRouter);
router.use("/schedules", scheduleRouter);
router.use("/variableSchedules", variableScheduleRouter);
router.use("/canceledSchedules", canceledScheduleRouter);

/** Error handling */
router.use((req, res) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message
  });
});
