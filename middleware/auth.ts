import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/db";

export const handleCheckingAuth = async (
  req,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.users.findUnique({
      where: { id: payload.user_id },
      select: {
        id: true,
        last_name: true,
        user_name: true,
      },
    });
    req.user = user;

    req.user = {
      id: payload.user_id,
      user_name: payload.name,
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Authentication Invalid" });
  }
};
