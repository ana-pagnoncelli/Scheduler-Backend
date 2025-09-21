/** source/routes/posts.ts */
import { Router } from "express";
import {
  addOrUpdateCanceledSchedule,
  deleteCanceledSchedule,
  getCanceledSchedule,
  removeUserFromCanceledSchedule
} from "./canceledSchedulesController";

const router = Router();

router.post("/", addOrUpdateCanceledSchedule);
router.get("/:id", getCanceledSchedule);
router.delete("/:id", deleteCanceledSchedule);
router.put(
  "/removeUser/:userEmail/FromCanceledSchedule/:scheduleId",
  removeUserFromCanceledSchedule
);

export { router as canceledScheduleRouter };
