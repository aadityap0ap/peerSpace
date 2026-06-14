import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { User } from "../db/db";
const router = Router();

router.get("/search",authMiddleware,async(req,res) => {
    try{
        const uniqueId = req.query.uniqueId as string;
        // const user = await User.findOne({uniqueId : uniqueId,});
          const user = await User.findOne({uniqueId}).select("-password");
          if(!user){
            return res.status(404).json({
                message : "User Not Found!"
            });
          }
          return res.status(200).json({
            user
          })
    }
    catch(error){
        return res.status(500).json({
            message : "Backend Error && Server Crashed!"
        })
    }
})

export default router;