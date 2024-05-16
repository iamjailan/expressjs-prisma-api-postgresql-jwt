import { Router } from "express";
import {
  createPost,
  deletePostById,
  getAllPost,
  getPostById,
  getPostByUser,
  updatePostById,
} from "../controllers/post";
import { handleCheckingAuth } from "../middleware/auth";

const postRouter = Router();

postRouter.use(handleCheckingAuth);
postRouter.route("/").get(getAllPost);
postRouter.route("/user-post").get(getPostByUser);
postRouter.route("/create-post").post(createPost);
postRouter
  .route("/user-post/:id")
  .get(getPostById)
  .put(updatePostById)
  .delete(deletePostById);

export default postRouter;
