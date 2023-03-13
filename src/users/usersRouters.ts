/** source/routes/posts.ts */
import { Router } from "express";
import { addUser, getUsers } from "./usersController";

const router = Router();

router.post("/", addUser);
router.get("/", getUsers);

export { router as userRouter };
