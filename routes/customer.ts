import express from "express";
import { createCustomer } from "../controllers/customer";

const customerRoute = express.Router();

customerRoute.route("/").post(createCustomer);

export default customerRoute;
