//in here we create api end points...

import express from "express";
import { login, logout, register } from "../controllers/userController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;