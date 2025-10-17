import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://img.icons8.com/?size=100&id=84898&format=png&color=000000'
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
