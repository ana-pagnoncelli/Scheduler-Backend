/** source/routes/posts.ts */
import { Router } from "express";
import {
  updateVariableSchedule,
  deleteVariableSchedule,
  getVariableSchedule,
  addUserInVariableSchedule,
  removeUserFromVariableSchedule,
  addOrUpdateVariableSchedule
} from "./variableSchedulesController";
import { getSchedulesForAListOfDays } from "./scheduleForAListOfDays";

const router = Router();

router.post("/", addOrUpdateVariableSchedule);
router.put("/:id", updateVariableSchedule);
router.get("/:id", getVariableSchedule);
router.delete("/:id", deleteVariableSchedule);
router.put(
  "/addUser/:userEmail/InVariableSchedule/:scheduleId",
  addUserInVariableSchedule
);
router.put(
  "/removeUser/:userEmail/FromVariableSchedule/:scheduleId",
  removeUserFromVariableSchedule
);
router.post("/get/forAListOfDays/", getSchedulesForAListOfDays);

export { router as variableScheduleRouter };
