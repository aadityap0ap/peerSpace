import {Router } from "express";
import { User } from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
const router = Router()
configDotenv();

router.post("/signup",async(req,res) => {
    try{
        const {email,username,password} = req.body;
        const findDuplicate = await User.findOne({email});
        if(findDuplicate){
            return res.status(400).json({
                message : "User with this email already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            email,
            username,
            password:hashedPassword
        });
        return res.status(200).json({
            message:"Account Created Successfully!"
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Backend Error ! && Server Crahsed !"
        })
    }
})

router.post("/signin",async(req,res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invalid Email!"
            });
        }
        const matched = await bcrypt.compare(
            password,
            user.password as string
        );
        if(!matched){
            return res.status(400).json({
                message:"Invalid PassWord!"
            })
        }
        const token = jwt.sign(
            {id : user._id},
            process.env.JWT_USER_PASSWORD as string
        )
        return res.status(200).json({
            message : "Welcome to PeerSpace",
            token
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Backend Erorr || Server Crahsed !"
        })
    }
})

export default router;