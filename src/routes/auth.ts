import {Router } from "express";
import { User } from "../db/db";
import { runInNewContext } from "node:vm";
const router = Router()

router.post("/signup",async(req,res) => {
    try{
        const {username,password} = req.body;
        await User.create({
            username,
            password
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
        const {username,password} = req.body;
        const find = await User.findOne({password});
        if(!find){
            return res.status(400).json({
                message:"Invalid PassWord!"
            });
        }
        return res.status(200).json({
            message : `Welcome to PeerSpace ${username}`
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Backend Erorr || Server Crahsed !"
        })
    }
})

export default router;