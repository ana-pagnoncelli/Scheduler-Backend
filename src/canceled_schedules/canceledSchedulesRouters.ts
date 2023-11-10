/** source/routes/posts.ts */
import { Router } from "express";
import {
  addCanceledSchedule,
  updateCanceledSchedule,
  deleteCanceledSchedule,
  getCanceledSchedule,
  addUserInCanceledSchedule,
  removeUserFromCanceledSchedule
} from "./canceledSchedulesController";

const router = Router();

router.post("/", addCanceledSchedule);
router.put("/:id", updateCanceledSchedule);
router.get("/:id", getCanceledSchedule);
router.delete("/:id", deleteCanceledSchedule);
router.put(
  "/addUser/:userEmail/InCanceledSchedule/:scheduleId",
  addUserInCanceledSchedule
);
router.put(
  "/removeUser/:userEmail/FromCanceledSchedule/:scheduleId",
  removeUserFromCanceledSchedule
);

export { router as canceledScheduleRouter };
