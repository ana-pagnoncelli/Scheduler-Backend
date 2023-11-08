/** source/routes/posts.ts */
import { Router } from "express";
import {
  addUser,
  getUsers,
  getUser,
  login,
  updateUser,
  deleteUser
} from "./usersController";

const router = Router();

router.post("/", addUser);
router.get("/", getUsers);
router.get("/:email", getUser);
router.put("/:email", updateUser);
router.delete("/:email", deleteUser);
router.post("/login", login);

export { router as userRouter };
