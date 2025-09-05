import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";

import {
    getProducts,
    getProductById,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.route("/profile").get(protect,getUserProfile).put(protect, updateUserProfile);
router.route("/:id").get(protect, admin, getUserById).delete(protect, admin, deleteUser).put(protect, admin, updateUser);

export default router;
