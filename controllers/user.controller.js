import User from "../models/user.model.js";
import fs from "fs";
import bcryptjs from "bcryptjs";
import configuredCloudinary from "../utils/cloudinay.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";


export const updateProfile = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your profile"));
  }
  try {
    const dataToUpdate = {
      username: req.body.username,
      email: req.body.email,
    };

    if (req.body.password && req.body.password.trim().length > 3) {
      dataToUpdate.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // If avatar file exists, upload to Cloudinary
    if (req.file) {
      const result = await configuredCloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
      });
      fs.unlinkSync(req.file.path);
      dataToUpdate.avatar = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: dataToUpdate
    }, { new: true });

    if(!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(
      {success: true, message: "Profile updated successfully", user: {...rest}}
    );
  } catch (error) {
    next(errorHandler(500, "Failed to update profile"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "Not authorized! You can delete only your account!"))
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "User has been deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
} 

export const getUserListings = async (req, res, next) =>{
  if(req.user.id === req.params.id){
    try{
      const listings = await Listing.find({userRef: req.params.id});
      res.status(200).json(listings);
    }catch(error){
      next(error);
    }
  }else{
    return next(errorHandler(401,"You can view only your own listings!"));
  }
}
