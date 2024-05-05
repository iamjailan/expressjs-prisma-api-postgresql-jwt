import express from "express";
import userRouter from "./user";
import customerRoute from "./customer";

const router = express.Router();

router.use("/user", userRouter);
router.use("/customer", customerRoute);

export default router;
