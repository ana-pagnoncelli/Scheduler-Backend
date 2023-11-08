/** source/routes/posts.ts */
import { Router } from "express";
import {
  addSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedule
} from "./schedulesController";

const router = Router();

router.post("/", addSchedule);
router.put("/:id", updateSchedule);
router.get("/:id", getSchedule);
router.delete("/:id", deleteSchedule);

export { router as scheduleRouter };
