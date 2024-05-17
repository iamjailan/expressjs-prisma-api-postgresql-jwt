import express from "express";
import authRouter from "./src/routes/auth.ts";
import userRouter from "./src/routes/user.ts";
import postRouter from "./src/routes/post.ts";
import taskRouter from "./src/routes/tasks.ts";
import { handleCheckingAuth } from "./src/middleware/auth.ts";
import notFound from "./src/middleware/notFount.ts";
import prisma from "./src/utils/db.ts";

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
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`server is running on port:${PORT}`);
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

start();
