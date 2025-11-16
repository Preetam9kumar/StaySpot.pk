import express from "express";
import multer from "multer";
import { updateProfile, deleteUser, getUserListings, getUser} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const router = express.Router();
const upload = multer({ dest: "stayspot/profiles" }); // temp local folder

// PUT /api/profile/update/:id
router.put("/update/:id", verifyUser, upload.single("avatar"), updateProfile);
router.delete("/delete/:id", verifyUser, deleteUser);
router.get('/listings/:id',verifyUser,getUserListings);
router.get('/:id',verifyUser, getUser);

export default router;
