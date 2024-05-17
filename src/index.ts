import express from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import taskRouter from "./routes/tasks";
import { handleCheckingAuth } from "./middleware/auth";
import notFound from "./middleware/notFount";
import prisma from "./utils/db";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ data: "Welcome to Express API with Prisma ORM!" });
});
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", handleCheckingAuth, userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/task", taskRouter);

app.use(notFound);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`server is running on port:${PORT}`);
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

start();
