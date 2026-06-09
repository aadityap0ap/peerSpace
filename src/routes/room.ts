import { Router } from "express";
import { room} from "../db/db";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/createRoom",authMiddleware,async(req,res) => {
    try{
        const userId = (req as any).userId;
        const roomId = Math.random().toString(36).substring(2,10);
        await room.create({
            roomId,
            createdBy : userId
        })
        return res.status(201).json({
            roomId
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Room not generated && Backend Error!"
        })
    }
})

export default router;