/** source/routes/posts.ts */
import { Router } from "express";
import { addSchedule } from "./schedulesController";

const router = Router();

router.post("/", addSchedule);

export { router as scheduleRouter };
