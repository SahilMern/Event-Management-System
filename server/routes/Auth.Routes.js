import express from "express";
import { login, register } from "../controllers/Auth.controller.js";
const router = express.Router();

router.post("/register", register); //? Register User
router.post("/login", login); //?Login User

export default router;
