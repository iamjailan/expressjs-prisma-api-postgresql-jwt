import { Customers } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../utils/db";

export const createCustomer = async (req: Request, res: Response) => {
  const { name, age, location, gender }: Customers = req.body;

  try {
    if (!name || !age || !location || !gender) {
      throw new Error("All fields are required");
    }
    const customer = await prisma.customers.create({
      data: {
        name,
        age,
        location,
        gender,
      },
    });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
