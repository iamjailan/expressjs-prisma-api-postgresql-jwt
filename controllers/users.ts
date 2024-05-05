import { Users } from "@prisma/client";
import prisma from "../utils/db";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

export const getAllUser = async (req: Request, res: Response) => {
  const users = await prisma.users.findMany();

  res.status(200).json({ success: true, data: users });
};

export const getSingleUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  let statusCode = 400;
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

export const createUser = async (req: Request, res: Response) => {
  const { user_name, last_name, password, email }: Users = req.body;
  let errorCode = 400;
  try {
    if (!user_name || !last_name || !password || !email) {
      throw new Error(
        "Please provide the name, last name, email, and password to create a user"
      );
    }
    const userEmail = await prisma.users.findUnique({
      where: { email: email },
    });
    if (userEmail) {
      throw new Error("User with this email already exist!");
    }
    if (password.length < 8) {
      throw new Error("Password should be more then 8 words");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: Users = await prisma.users.create({
      data: {
        user_name: user_name,
        last_name: last_name,
        password: hashedPassword,
        email: email,
      },
    });

    const { password: updatedPassword, ...returnUser } = user;

    res.status(200).json({
      success: true,
      data: returnUser,
    });
  } catch (error) {
    res.status(errorCode).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { last_name, password, user_name, email }: Users = req.body;
  const userId = req.params.id;
  let statusCode = 400;
  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      statusCode = 404;
      throw new Error(`User not found with ID:${userId}`);
    }

    if (password.length < 8) {
      throw new Error("Password should be more then 8 words");
    }
    // const checkPassword = await bcrypt.compare(password, user.password);

    // if (!checkPassword) {
    //   throw new Error("Password not match");
    // }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        last_name: last_name,
        password: hashedPassword,
        user_name: user_name,
        email: email,
      },
    });

    const { password: updatedPassword, ...returnUser } = updatedUser;

    res.status(200).json({ success: true, data: returnUser });
  } catch (error) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
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
