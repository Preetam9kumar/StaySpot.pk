import express from "express";
import multer from "multer";
import { updateProfile, deleteUser} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp local folder

// PUT /api/profile/update/:id
router.put("/update/:id", verifyUser, upload.single("avatar"), updateProfile);
router.delete("/delete/:id", verifyUser, deleteUser);

export default router;

