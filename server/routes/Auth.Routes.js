import express from "express";
import { login, logout, register, verifyUser } from "../controllers/Auth.controller.js";
import { verifyUserToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/register", register); //? Register User
router.post("/login", login); //?Login User
router.get("/verifyUser",verifyUserToken,verifyUser); //?Login User

router.post("/logout", logout); //?Login User



export default router;
