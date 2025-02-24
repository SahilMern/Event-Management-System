import express from "express";
import { login, logout, register } from "../controllers/Auth.controller.js";
const router = express.Router();

router.post("/register", register); //? Register User
router.post("/login", login); //?Login User
router.post("/logout", logout); //?Login User



export default router;
