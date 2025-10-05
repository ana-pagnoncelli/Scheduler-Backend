/** source/routes/posts.ts */
import { Router } from "express";
import {
  addOrUpdateCanceledSchedule,
  deleteCanceledSchedule,
  getCanceledSchedule
} from "./canceledSchedulesController";

const router = Router();

router.post("/", addOrUpdateCanceledSchedule);
router.get("/:id", getCanceledSchedule);
router.delete("/:id", deleteCanceledSchedule);

export { router as canceledScheduleRouter };
