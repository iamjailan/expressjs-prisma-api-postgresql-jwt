import express from "express";
import authRouter from "./routes/auth";
import prisma from "./utils/db";
import { handleCheckingAuth } from "./middleware/auth";
import userRouter from "./routes/user";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ data: "Hello" });
});
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", handleCheckingAuth, userRouter);

const start = async () => {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`server is running on port:${PORT}`);
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

start();
