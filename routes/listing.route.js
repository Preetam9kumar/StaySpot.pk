import express from 'express';
import multer from 'multer';
import { verifyUser } from '../utils/verifyUser.js';
import { createListing, deleteListing, updateListing, getListing, getListings} from '../controllers/listing.cotroller.js';
const router = express.Router();
const upload = multer({ dest: "stayspot/listing-images" }); // temp local folder

router.post('/create', verifyUser,upload.array("imageUrls", 6), createListing);
router.delete('/delete/:id',verifyUser, deleteListing);
router.put('/update/:id',verifyUser,upload.array('imageUrls', 6),updateListing);
router.get('/get/:id',getListing);
router.get('/get', getListings);
export default router;
