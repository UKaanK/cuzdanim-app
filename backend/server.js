// const express = require("express")
import express from 'express'
import dotenv from 'dotenv'
import {sql} from './config/db.js' // Adjust the import path as necessary

dotenv.config()

const app = express();

//middleware
app.use(express.json())
app.use((req,res,next)=>{
    console.log("hey we git a req, the method is",req.method)
    next()
})

const PORT= process.env.PORT || 5001

async function initDB(){
    try{
        await sql`
        CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE   
        )
        `;

        console.log("Database initialized succesfuly")
    }catch(error){
        console.log("Error initializing database:", error)
        process.exit(1) //status code 1 an erro ,
    }
}

app.get("/",(req,res)=>{
    res.send("working")
})

app.get("/api/transactions/:userId",async(req,res)=>{
    try{
        const {userId} = req.params;
        const transaction=await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;`
        res.status(200).json(transaction);
        console.log(userId)
    }catch(error){
          console.log("Error getting the  transaction:",error)
        res.status(500).json({ error: "Internal server error" });
    }
})

app.post("/api/transactions",async (req,res)=>{
    //title,amount,category,user_id
    try{
        const{title,amount,category,user_id}=req.body;

        if (!title || !amount || !category || !user_id===undefined) {
            return res.status(400).json({ error: "All fields are required" });
        }

      const transaction=  await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *;`
      console.log("Transaction created:", transaction)
      res.status(201).json(transaction[0]); // Return the created transaction
    }catch(error){
        console.log("Error creating transaction:",error)
        res.status(500).json({ error: "Internal server error" });
    }
})

app.delete("api/transactions/:id",async(req,res)=>{
    try{

    }catch(error){
        console.log("Error deleting transaction:",error)
        res.status(500).json({ error: "Internal server error" });
    }
})

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})