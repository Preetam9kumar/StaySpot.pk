import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from '../routes/auth.route.js';
import userRouter from '../routes/user.route.js';
import listingRouter from '../routes/listing.route.js';
dotenv.config({path: './.env'});
import cookieParser from 'cookie-parser';

mongoose.connect(process.env.DBURI)
.then(() => {
  console.log('Connected to DB');
})
.catch(err => console.log(err));    

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

app.get('/api', (req, res) => {
  res.send('Hello World!');
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  return res.status(status).json({
    success: false,
    status,
    message
  }); 
});

app.listen(process.env.PORT, () => {
  console.log('Server is running...');
});
