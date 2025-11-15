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
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }
        if (req.user.id !== listing.userRef.toString()) {
            return next(errorHandler(401, 'You can only update your own listings!'));
        }

        console.log('=== DEBUG INFO ===');
        console.log('req.body.imageUrls:', req.body.imageUrls);
        console.log('req.files:', req.files);
        console.log('req.files length:', req.files ? req.files.length : 0);

        const updatedImageUrls = [];

        // Check and upload non-Cloudinary URLs from imageUrls array
        if (req.body.imageUrls && req.body.imageUrls.length > 0) {
            const imageUrlsArray = Array.isArray(req.body.imageUrls)
                ? req.body.imageUrls
                : [req.body.imageUrls];

            console.log('imageUrlsArray:', imageUrlsArray);

            let fileIndex = 0;

            for (const imageUrl of imageUrlsArray) {
                console.log(`Processing imageUrl: ${imageUrl}`);

                // If it's already a Cloudinary URL, keep it
                if (imageUrl.includes('cloudinary.com')) {
                    console.log('  -> Cloudinary URL, keeping it');
                    updatedImageUrls.push(imageUrl);
                }
                // If it's a blob URL, upload the corresponding file from req.files
                else if (req.files && req.files[fileIndex]) {
                    console.log(`  -> Blob URL, uploading file at index ${fileIndex}`);
                    console.log(`  -> File path: ${req.files[fileIndex].path}`);
                    try {
                        const result = await configuredCloudinary.uploader.upload(
                            req.files[fileIndex].path,
                            { folder: 'uploads' }
                        );
                        console.log(`  -> Upload success: ${result.secure_url}`);
                        updatedImageUrls.push(result.secure_url);
                        fs.unlinkSync(req.files[fileIndex].path);
                        fileIndex++;
                    } catch (uploadError) {
                        console.error('Upload error:', uploadError);
                        return next(errorHandler(500, `Failed to upload image: ${uploadError.message}`));
                    }
                } else {
                    console.log('  -> Skipping (no matching file)');
                }
            }
        }

        console.log('Final updatedImageUrls:', updatedImageUrls);

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
        console.error('Error in updateListing:', error);
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
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] }
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;
        let rent, sale;

        if (!type || type === "all") {
            rent = { $in: [false, true] };
            sale = { $in: [false, true] };
        } else if (type === "rent") {
            rent = true;
            sale = false;
        } else if (type === "sale") {
            rent = false;
            sale = true;
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            rent,
            sale,
        }).sort({ [sort]: order }).limit(limit).skip(startIndex);
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
}
