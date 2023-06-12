/** source/routes/posts.ts */
import { Router } from "express";
import { addUser, getUsers, login } from "./usersController";

const router = Router();

router.post("/", addUser);
router.get("/", getUsers);
router.post("/login", login);

export { router as userRouter };
