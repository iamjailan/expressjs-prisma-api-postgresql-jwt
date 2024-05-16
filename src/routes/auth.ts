import express from "express";
import { createUser, handleLogin } from "../controllers/auth";

const authRouter = express.Router();

authRouter.route("/login").post(handleLogin);
authRouter.route("/register").post(createUser);

export default authRouter;
