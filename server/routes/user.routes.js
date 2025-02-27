import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  changeUserRole,
} from "../controllers/User.controller.js";
const router = express.Router();

// Routes
router.get("/", getAllUsers); // Get all users
router.get("/:id", getSingleUser); // Get a single user by ID
router.put("/:id", updateUser); // Update a user by ID
router.delete("/:id", deleteUser); // Delete a user by ID
router.patch("/:id/change-role", changeUserRole); // Change user role by ID

export default router;
