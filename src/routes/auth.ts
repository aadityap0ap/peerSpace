import {Router } from "express";
import { User } from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
const router = Router()
configDotenv();

router.post("/signup",async(req,res) => {
    try{
        const {uniqueId,email,username,password} = req.body;
        const existingUniqueId = await User.findOne({uniqueId});
        if(existingUniqueId){
            return res.status(409).json({
                message : "user With this uniqueId Exists!"
            });
        }
        const findDuplicate = await User.findOne({email});
        if(findDuplicate){
            return res.status(409).json({
                message : "User with this email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            uniqueId,
            email,
            username,
            password:hashedPassword
        });
        return res.status(201).json({
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
        const {uniqueId,password} = req.body;
        const user = await User.findOne({uniqueId});
        if(!user){
            return res.status(401).json({
                message:"Invalid uniqueId && uniqueId not found!"
            });
        }
        const matched = await bcrypt.compare(
            password,
            user.password as string
        );
        if(!matched){
            return res.status(401).json({
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