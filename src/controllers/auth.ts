import prisma from "../utils/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

export const handleLogin = async (req, res: Response) => {
  let statusCode = 400;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please Provide user Email and Password");
    }

    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      statusCode = 404;
      throw new Error(
        "User with this email not found please create an account first!"
      );
    }
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      statusCode = 401;
      throw new Error("Invalid credential");
    }
    const token = jwt.sign(
      {
        user_id: user.id,
        name: user.user_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIME }
    );
    const { password: userPassword, email: userEmail, ...returnUser } = user;
    res
      .status(statusCode)
      .json({ success: true, data: returnUser, token: token });
  } catch (error) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const {
    user_name,
    last_name,
    password,
    email,
    image,
    age,
    gender,
    city,
    country,
  } = req.body;
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

    const user = await prisma.users.create({
      data: {
        user_name: user_name,
        last_name: last_name,
        password: hashedPassword,
        email: email,
        image: image,
        gender,
        age,
        city,
        country,
      },
    });

    const { password: updatedPassword, ...returnUser } = user;

    const token = jwt.sign(
      {
        user_id: user.id,
        name: user.user_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIME }
    );

    res.status(200).json({
      success: true,
      data: returnUser,
      token: token,
    });
  } catch (error) {
    res.status(errorCode).json({ success: false, message: error.message });
  }
};
