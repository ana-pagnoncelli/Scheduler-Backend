/** source/routes/posts.ts */
import { Router } from "express";
import {
  addVariableSchedule,
  updateVariableSchedule,
  deleteVariableSchedule,
  getVariableSchedule,
  addUserInVariableSchedule,
  removeUserFromVariableSchedule
} from "./variableSchedulesController";

const router = Router();

router.post("/", addVariableSchedule);
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

export { router as variableScheduleRouter };