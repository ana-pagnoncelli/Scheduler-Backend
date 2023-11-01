/** source/routes/posts.ts */
import { Router } from "express";
import {
  addUser,
  getUsers,
  getUser,
  login,
  updateUser
} from "./usersController";

const router = Router();

router.post("/", addUser);
router.get("/", getUsers);
router.get("/:email", getUser);
router.put("/:email", updateUser);
router.post("/login", login);

export { router as userRouter };
