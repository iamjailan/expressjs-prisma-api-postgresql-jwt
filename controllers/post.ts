import { Request, Response } from "express";
import prisma from "../utils/db";
import { Post } from "@prisma/client";

export const getAllPost = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany();

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createPost = async (req, res: Response) => {
  const { description, title }: Post = req.body;
  const userId = req.user.id;

  try {
    if (!description || !title) {
      throw new Error("Please provide description and title");
    }

    const post = await prisma.post.create({
      data: { description: description, title: title, usersId: userId },
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
