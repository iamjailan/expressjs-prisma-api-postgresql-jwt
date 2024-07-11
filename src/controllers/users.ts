import prisma from "../utils/db";
import bcrypt from "bcrypt";
import { Response } from "express";
import createObjectFromArray from "../utils/createObjectFromArray";
import { validate, validateOrReject } from "class-validator";
import { UpdateUserValidator } from "../utils/validator";

export const getAllUser = async (req, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const offset = req.query.offset ? Number(req.query.offset) : 0;
  const order_by: string = req.query.order_by ? req.query.order_by : "id";
  const sort_by: "asc" | "desc" = req.query.sort_by ? req.query.sort_by : "asc";

  try {
    const fields: string[] = [
      "id",
      "user_name",
      "last_name",
      "country",
      "city",
      "image",
    ];

    if (!fields.includes(order_by)) {
      throw new Error(`${order_by} does
    not exist`);
    }

    const [users, count] = await prisma.$transaction([
      prisma.users.findMany({
        take: limit,
        skip: offset * limit,
        select: createObjectFromArray(fields),
        orderBy: createObjectFromArray([order_by], sort_by),
      }),
      prisma.users.count(),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      limit: limit,
      offset: offset,
      count: count,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSingleUser = async (req, res: Response) => {
  let statusCode = 400;
  const userId = req.user.id;

  const fields: string[] = [
    "id",
    "createdAt",
    "updatedAt",
    "user_name",
    "last_name",
    "age",
    "gender",
    "city",
    "country",
    "image",
  ];

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: createObjectFromArray(fields),
    });
    if (!user) {
      statusCode = 404;
      throw new Error(`User not found with ID:${userId}`);
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res: Response) => {
  const updateData = new UpdateUserValidator();
  const {
    last_name,
    user_name,
    email,
    image,
    age,
    gender,
    city,
    country,
  }: UpdateUserValidator = req.body;
  const userId = req.user.id;

  updateData.last_name = last_name;
  updateData.user_name = user_name;
  updateData.email = email;
  updateData.image = image;
  updateData.age = age;
  updateData.gender = gender;
  updateData.city = city;
  updateData.country = country;

  let statusCode = 400;

  try {
    await validateOrReject(updateData);

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      statusCode = 404;
      throw new Error(`User not found with ID:${userId}`);
    }

    // if (password && password.length < 8) {
    //   throw new Error("Password should be more then 8 words");
    // }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        last_name: last_name,
        user_name: user_name,
        email: email,
        image: image,
        age,
        gender,
        country,
        city: city,
      },
    });

    const { password: updatedPassword, ...returnUser } = updatedUser;

    res.status(200).json({ success: true, data: returnUser });
  } catch (error) {
    res.status(statusCode).json({
      success: false,
      message: error.message || error.map((item) => item.constraints),
    });
  }
};

export const deleteUser = async (req, res: Response) => {
  const userId = req.user.id;
  let statusCode = 400;

  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      statusCode = 404;
      throw new Error(`User not found with ID:${userId}`);
    }

    await prisma.users.delete({ where: { id: userId } });
    res
      .status(200)
      .json({ success: true, message: `${userId} deleted successfully!` });
  } catch (error) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};
