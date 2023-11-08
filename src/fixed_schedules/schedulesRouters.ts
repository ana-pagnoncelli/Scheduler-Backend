/** source/routes/posts.ts */
import { Router } from "express";
import {
  addSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedule,
  addUserInSchedule,
  removeUserFromSchedule
} from "./schedulesController";

const router = Router();

router.post("/", addSchedule);
router.put("/:id", updateSchedule);
router.put("/addUser/:userEmail/InSchedule/:scheduleId", addUserInSchedule);
router.put(
  "/removeUser/:userEmail/FromSchedule/:scheduleId",
  removeUserFromSchedule
);
router.get("/:id", getSchedule);
router.delete("/:id", deleteSchedule);

export { router as scheduleRouter };
