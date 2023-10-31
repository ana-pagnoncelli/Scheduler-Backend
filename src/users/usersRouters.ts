/** source/routes/posts.ts */
import { Router } from "express";
import { addUser, getUsers, getUser, login } from "./usersController";

const router = Router();

router.post("/", addUser);
router.get("/", getUsers);
router.get("/:email", getUser);
router.post("/login", login);

export { router as userRouter };
