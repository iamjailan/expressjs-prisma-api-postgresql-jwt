import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
} from "../controllers/users";

const userRouter = express.Router();

userRouter.route("/").get(getAllUser).post(createUser);
userRouter.route("/:id").put(updateUser).get(getSingleUser).delete(deleteUser);

export default userRouter;
