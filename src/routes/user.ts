import express from "express";
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
} from "../controllers/users";

const userRouter = express.Router();

userRouter.route("/").get(getSingleUser).put(updateUser).delete(deleteUser);
userRouter.route("/getAllUsers").get(getAllUser);

export default userRouter;
