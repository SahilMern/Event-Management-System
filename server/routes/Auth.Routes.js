import express from "express";

const router = express.Router();
import {
  login,
  logout,
  register,
  verifyUser,
} from "../controllers/Auth.controller.js";
import { verifyUserToken } from "../middleware/verifyToken.js"; //Verify Token

router.post("/register", register); //! Register User
router.post("/login", login); //!Login User
router.get("/verifyUser", verifyUserToken, verifyUser); //!Login User
router.post("/logout", verifyUserToken, logout); //!Logout User

export default router;
