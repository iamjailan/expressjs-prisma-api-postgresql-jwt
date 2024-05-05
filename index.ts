import express from "express";
import router from "./routes";
import prisma from "./utils/db";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ data: "Hello" });
});
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

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
