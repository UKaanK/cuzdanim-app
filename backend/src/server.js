// const express = require("express")
import express from 'express'
import dotenv from 'dotenv'
import {initDB} from './config/db.js' // Adjust the import path as necessary
import rateLimiter from './middleware/rateLimiter.js';
import job from './config/cron.js';
import transactionsRoute from './routes/transactionsRoute.js'

dotenv.config()

const app = express();
if (process.env.NODE_ENV === "production") job.start();

//middleware
app.use(rateLimiter);
app.use(express.json())


//custom simple middleware
// app.use((req,res,next)=>{
//     console.log("hey we git a req, the method is",req.method)
//     next()
// })

const PORT= process.env.PORT || 5001

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions",transactionsRoute)


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})