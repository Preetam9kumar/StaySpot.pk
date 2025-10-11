import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({path: './.env'});

mongoose.connect(process.env.DBURI)
.then(() => {
  console.log('Connected to DB');
})
.catch(err => console.log(err));    


const app = express();


app.listen(process.env.PORT, () => {
  console.log('Server is running...');
});
