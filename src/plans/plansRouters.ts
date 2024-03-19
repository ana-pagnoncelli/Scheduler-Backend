/** source/routes/posts.ts */
import { Router } from "express";
import {
  addPlan,
  getPlans,
  getPlan,
  updatePlan,
  deletePlan
} from "./plansController";

const router = Router();

router.post("/", addPlan);
router.get("/", getPlans);
router.get("/:id", getPlan);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);

export { router as planRouter };
