import { Request, Response } from "express";
import prisma from "../utils/db";
import createObjectFromArray from "../utils/createObjectFromArray";
import { Tasks } from "@prisma/client";

export const getAllTasks = async (req, res: Response) => {
  const limit: number = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset: number = req.query.offset ? parseInt(req.query.offset) : 0;
  const orderBy: string = req.query.order ? req.query.order : "id";
  const sort_by: "asc" | "desc" = req.query.sort_by ? req.query.sort_by : "asc";
  const fields: string[] = [
    "id",
    "status",
    "title",
    "description",
    "deadline",
    "createdAt",
  ];
  let errorCode = 400;
  try {
    if (!fields.includes(orderBy)) {
      errorCode = 423;
      throw new Error(`${orderBy} field not found in table!`);
    }
    const [allTasks, count] = await prisma.$transaction([
      prisma.tasks.findMany({
        select: createObjectFromArray(fields),
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
    "User.id",
  ];

  function createSelectObject(fields) {
    return fields.reduce((acc, field) => {
      if (field.includes(".")) {
        const [model, nestedField] = field.split(".");
        if (!acc[model]) acc[model] = {};
        acc[model][nestedField] = true;
      } else {
        acc[field] = true;
      }
      return acc;
    }, {});
  }

  const validOrderByFields = fields.map((field) =>
    field.includes(".") ? field.split(".")[0] : field
  );
  if (
    !validOrderByFields.includes(
      orderBy.includes(".") ? orderBy.split(".")[0] : orderBy
    )
  ) {
    const errorCode = 433;
    throw new Error(`${orderBy} field not found in table!`);
  }

  const selectObject = createSelectObject(fields);
  const includeObject = fields.includes("User.id")
    ? { User: { select: { id: true } } }
    : {};

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
        select: selectObject,
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
  const { deadline, description, status, title }: Tasks = req.body;
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
  const { deadline, description, status, title }: Tasks = req.body;
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
