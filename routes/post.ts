import { Router } from "express";
import { createPost, getAllPost } from "../controllers/post";

const postRouter = Router();

postRouter.route("/").get(getAllPost).post(createPost);

export default postRouter;
