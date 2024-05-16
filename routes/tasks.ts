import { Router } from "express";
import { handleCheckingAuth } from "../middleware/auth";
import {
  createTasks,
  getAllTasks,
  getTasksByCustomer,
  updateTask,
} from "../controllers/tasks";

const taskRouter = Router();

taskRouter.use(handleCheckingAuth);
taskRouter.get("/get-all-tasks", getAllTasks);
taskRouter.route("/").get(getTasksByCustomer).post(createTasks);
taskRouter.route("/:id").put(updateTask);

export default taskRouter;
