import { Request, Response } from "express";
import prisma from "../utils/db";
import { Post } from "@prisma/client";
import createObjectFromArray from "../utils/createObjectFromArray";

export const getAllPost = async (req, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const offset = req.query.offset ? Number(req.query.offset) : 0;
  const order_by: string = req.query.order_by ? req.query.order_by : "id";
  const sort_by: "asc" | "desc" = req.query.sort_by ? req.query.sort_by : "asc";

  const fields: string[] = [
    "id",
    "title",
    "description",
    "images",
    "createdAt",
    "updatedAt",
  ];

  try {
    if (!fields.includes(order_by)) {
      throw new Error(`${order_by} fields does not exit in table`);
    }
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany({
        take: limit,
        skip: offset * limit,
        orderBy: createObjectFromArray([order_by], sort_by),
        select: createObjectFromArray(fields),
      }),

      prisma.post.count(),
    ]);

    res.status(200).json({
      success: true,
      data: posts,
      limit: limit,
      offset: offset,
      count: count,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createPost = async (req, res: Response) => {
  const { description, title, images }: Post = req.body;
  const userId = req.user.id;

  try {
    if (!description || !title) {
      throw new Error("Please provide description and title");
    }

    if (images && !Array.isArray(images)) {
      throw new Error("images must be an array!");
    }

    const post = await prisma.post.create({
      data: {
        description: description,
        title: title,
        usersId: userId,
        images: images,
      },
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPostByUser = async (req, res: Response) => {
  const userId: string = req.user.id;
  const limit: number = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset: number = req.query.offset ? parseInt(req.query.offset) : 0;

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany({
        where: { usersId: userId },
        take: limit,
        skip: offset * limit,
      }),
      prisma.post.count(),
    ]);

    res.status(200).json({
      success: true,
      data: posts,
      limit: limit,
      offset: offset,
      count: count,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  let statusCode = 400;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      statusCode = 404;
      throw new Error(`Post not found with id:${postId}`);
    }
    const postUser = await prisma.users.findUnique({
      where: { id: post.usersId },
      select: {
        age: true,
        user_name: true,
        id: true,
        email: true,
      },
    });

    res.status(200).json({ success: true, data: postUser });
  } catch (error) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const updatePostById = async (req: Request, res: Response) => {
  const { description, title, images }: Post = req.body;
  const postId = req.params.id;
  let statusCode = 400;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      statusCode = 404;
      throw new Error(`post not found with id: ${postId}`);
    }

    const updatePost = await prisma.post.update({
      where: { id: postId },
      data: { title: title, description: description, images: images },
    });
    res.status(200).json({ success: true, data: updatePost });
  } catch (error) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const deletePostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  let statusCode = 400;
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      statusCode = 404;
      throw new Error(`Post not found with id ${postId} to delete`);
    }
    await prisma.post.delete({ where: { id: postId } });

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully!" });
  } catch (error) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};
