import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import fs from "fs";
import configuredCloudinary from "../utils/cloudinay.js";

export const createListing = async (req, res, next) => {
    try {
        const imageUrls = [];

        // Handle files upload  
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await configuredCloudinary.uploader.upload(file.path, {
                    folder: "uploads",
                });
                fs.unlinkSync(file.path);

                imageUrls.push(result.secure_url);
            }
        }

        const listingData = {
            ...req.body,
            imageUrls,
        };

        const listing = await Listing.create(listingData);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found'));
    }
    if (req.user.id !== listing.userRef.toString()) {
        return next(errorHandler(401, 'You can only delete your own listing !'));
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json(
            {
                "success": true,
                "message": "Listing Deleted Successfully!"
            }
        )
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) return next(errorHandler(404, 'Listing not found!'));

        if (req.user.id !== listing.userRef.toString())
            return next(errorHandler(401, 'You can only update your own listings!'));

        let updatedImageUrls = [];

        if (req.body.existingImages) {
            updatedImageUrls = Array.isArray(req.body.existingImages)
                ? req.body.existingImages
                : JSON.parse(req.body.existingImages);
        }

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await configuredCloudinary.uploader.upload(file.path, {
                    folder: "uploads"
                });

                updatedImageUrls.push(result.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        const updatedListingData = {
            ...req.body,
            imageUrls: updatedImageUrls,
        };

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            { $set: updatedListingData },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedListing);

    } catch (error) {
        next(error);
    }
};

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "Listing not found !"));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        const query = {};

        // Search term
        const searchTerm = req.query.searchTerm || '';
        if (searchTerm) query.name = { $regex: searchTerm, $options: 'i' };

        // Offer
        if (req.query.offer === 'true') query.offer = true;
        else if (req.query.offer === 'false') query.offer = false;

        // Furnished
        if (req.query.furnished === 'true') query.furnished = true;
        else if (req.query.furnished === 'false') query.furnished = false;

        // Parking
        if (req.query.parking === 'true') query.parking = true;
        else if (req.query.parking === 'false') query.parking = false;

        // Type filter
        const type = req.query.type;
        if (type === 'rent') {
            query.rent = true;
            query.sale = false;
        } else if (type === 'sale') {
            query.rent = false;
            query.sale = true;
        }

        // Sorting
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order === 'asc' ? 1 : -1;

        const listings = await Listing.find(query)
            .sort({ [sortField]: sortOrder })
            .limit(limit)
            .skip(startIndex);

        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};

