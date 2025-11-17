import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from '../routes/auth.route.js';
import userRouter from '../routes/user.route.js';
import listingRouter from '../routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to DB
mongoose
  .connect(process.env.DBURI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//API routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

// Serve client build (Vite)
const clientDistPath = path.join(__dirname, '../client/dist');

app.use(express.static(clientDistPath));

//fallback
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack); // better logs
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
  });
});

//port fallback
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
