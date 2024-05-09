import { Users } from "@prisma/client";
import prisma from "../utils/db";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

export const getAllUser = async (req: Request, res: Response) => {
  const users = await prisma.users.findMany();

  const filteredUser = users.map((user) => {
    return {
      name: user.user_name,
      last_name: user.last_name,
    };
  });

  res.status(200).json({ success: true, data: filteredUser });
};

export const getSingleUser = async (req, res: Response) => {
  let statusCode = 400;
  const userId = req.user.id;

  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      statusCode = 404;
      throw new Error(`User not found with ID:${userId}`);
    }
    const { password, ...returnUser } = user;

    res.status(200).json({ success: true, data: returnUser });
  } catch (error) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res: Response) => {
  const { last_name, password, user_name, email, image, age, gender }: Users =
    req.body;
  const userId = req.user.id;
  let statusCode = 400;
  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      statusCode = 404;
      throw new Error(`User not found with ID:${userId}`);
    }

    if (!password && password.length < 8) {
      throw new Error("Password should be more then 8 words");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        last_name: last_name,
        password: hashedPassword,
        user_name: user_name,
        email: email,
        image: image,
        age,
        gender,
      },
    });

    const { password: updatedPassword, ...returnUser } = updatedUser;

    res.status(200).json({ success: true, data: returnUser });
  } catch (error) {
    res.status(statusCode).json({ success: false, message: error.message });
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
