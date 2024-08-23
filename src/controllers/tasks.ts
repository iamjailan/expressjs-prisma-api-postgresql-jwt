import { Request, Response } from "express";
import prisma from "../utils/db";
import createObjectFromArray from "../utils/createObjectFromArray";
import { createPrismaSelect } from "../utils/createFields";

export const getAllTasks = async (req, res: Response) => {
  const limit: number = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset: number = req.query.offset ? parseInt(req.query.offset) : 0;
  const orderBy: string = req.query.order ? req.query.order : "id";
  const sort_by: "asc" | "desc" = req.query.sort_by ? req.query.sort_by : "asc";
  const fields: string[] = [
    "id",
    "createdAt",
    "status",
    "title",
    "description",
    "deadline",
    "User.createdAt",
    "User.updatedAt",
    "User.id",
    "User.user_name",
    "User.last_name",
    "User.age",
    "User.image",
    "User.image",
  ];
  let errorCode = 400;
  try {
    if (!fields.includes(orderBy)) {
      errorCode = 423;
      throw new Error(`${orderBy} field not found in table!`);
    }
    const [allTasks, count] = await prisma.$transaction([
      prisma.tasks.findMany({
        select: createPrismaSelect(fields),
        skip: offset * limit,
        take: limit,
        orderBy: createObjectFromArray([orderBy], sort_by),
      }),
      prisma.tasks.count(),
    ]);

    res.status(200).json({
      success: true,
      data: allTasks,
      count: count,
      limit: limit,
      offset: offset,
    });
  } catch (error) {
    res.status(errorCode).json({ success: false, message: error.message });
  }
};

export const getTaskById = async (req, res: Response) => {
  const id = req.params.id;
  let errorCode = 400;
  try {
    const task = await prisma.tasks.findUnique({ where: { id: id } });

    if (!task) {
      errorCode = 404;
      throw new Error(`task with given id:${id} not found`);
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(errorCode).json({ success: false, message: error.message });
  }
};

export const getTasksByCustomer = async (req, res: Response) => {
  const userId = req.user.id;
  let errorCode = 400;
  const limit: number = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset: number = req.query.offset ? parseInt(req.query.offset) : 0;
  const orderBy: string = req.query.order ? req.query.order : "id";
  const sort_by: "asc" | "desc" = req.query.sort_by ? req.query.sort_by : "asc";

  const fields: string[] = [
    "id",
    "createdAt",
    "updatedAt",
    "status",
    "title",
    "description",
    "deadline",
  ];

  try {
    if (!fields.includes(orderBy)) {
      errorCode = 433;
      throw new Error(`${orderBy} field not found in table!`);
    }
    const [tasks, count] = await prisma.$transaction([
      prisma.tasks.findMany({
        where: { usersId: userId },
        take: limit,
        skip: offset * limit,
        select: createObjectFromArray(fields),
        orderBy: createObjectFromArray([orderBy], sort_by),
      }),
      prisma.tasks.count(),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
      count: count,
      limit: limit,
      offset: offset,
    });
  } catch (error) {
    res.status(errorCode).json({ success: false, message: error.message });
  }
};

export const createTasks = async (req, res: Response) => {
  let errorCode = 400;
  const userId = req.user.id;
  const { deadline, description, status, title } = req.body;
  try {
    if (!description || !title || !deadline) {
      throw new Error("Please description, title, and deadline of the task");
    }

    const task = await prisma.tasks.create({
      data: { deadline, description, title, status, usersId: userId },
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(errorCode).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res: Response) => {
  let errorCode = 400;
  const { deadline, description, status, title } = req.body;
  const id: string = req.params.id;
  try {
    const task = await prisma.tasks.findUnique({ where: { id: id } });
    if (!task) {
      errorCode = 404;
      throw new Error(`Task Not found with id:${id}1`);
    }
    const updateTask = await prisma.tasks.update({
      data: {
        deadline,
        description,
        status,
        title,
      },
      where: {
        id: id,
      },
    });
    res.status(201).json({ success: true, data: updateTask });
  } catch (error) {
    res.status(errorCode).json({ success: false, message: error.message });
  }
};

export const deleteTaskBy = async (req, res: Response) => {
  const id = req.params.id;
  let errorCode = 400;
  try {
    const task = await prisma.tasks.findUnique({ where: { id: id } });

    if (!task) {
      errorCode = 404;
      throw new Error(`task with given id:${id} not found`);
    }

    await prisma.tasks.delete({ where: { id: id } });

    res
      .status(200)
      .json({ success: true, message: "task deleted successfully" });
  } catch (error) {
    res.status(errorCode).json({ success: false, message: error.message });
  }
};
