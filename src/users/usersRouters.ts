/** source/routes/posts.ts */
import { Router } from "express";
import controller from "./usersController";

const router = Router();

router.get("/", controller.getPosts);
router.get("/:id", controller.getPost);
router.put("/:id", controller.updatePost);
router.delete("/:id", controller.deletePost);
router.post("/", controller.addPost);

export { router as userRouter };
