import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { conversation, friendRequest, User } from "../db/db";
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

router.post("/request",authMiddleware,async(req,res) => {
    try{
        const senderId = (req as any).userId;
        const {receiverId} = req.body;
        if(senderId == receiverId){
            return res.status(400).json({
                message : "You Can't send friend request to Yourself!"
            });
        }
        const receiver = await User.findOne({
            uniqueId: receiverId,
        });
        if(!receiver){
            return res.status(404).json({
                message : "Receiver Not Found!"
            });
        }
        const existingRequest = await friendRequest.findOne({
            sender:senderId,
            receiver:receiver._id,
            status: "pending"
        });
        if(existingRequest){
            return res.status(400).json({
                message : "Friend Request already Sent!"
            });
        }
        await friendRequest.create({
            sender : senderId,
            receiver : receiver._id,
            status: "pending"
        });

        return res.status(201).json({
            message : "Friend Request Sent Successfully!"
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message :"BackeEnd Error And Server Crashed!"
        })
    }
})

router.get("/pending",authMiddleware,async(req,res) => {
    try{
        const receiverid = (req as any).userId;

        const pendingRequest = await friendRequest.find({
            receiver:receiverid,
            status:"pending"
        }).populate("sender","username uniqueId");
        return res.status(200).json({
            pendingRequest,
        })
    }
    catch(error){
        return res.status(500).json({
            message: "Internal Sever Error!"
        })
    }
})

router.post("/accept",authMiddleware,async(req,res) => {
    try{
        const {requestId} = req.body;
        const request = await friendRequest.findById(requestId);
        if(!request){
            return res.status(404).json({
                message : "No Such request Found!"
            });
        }
        if(request.receiver.toString() !== (req as any).userId){
            return res.status(403).json({
                message : "you are not authorized!"
            });
        }
        request.status = "accepted";
        await request.save();

        await User.findByIdAndUpdate(request.sender,{
            $addToSet : {
                friends : request.receiver,
            },
        });

        await User.findByIdAndUpdate(request.receiver,{
            $addToSet : {
                friends : request.sender,
            }
        });

        return res.status(200).json({
            message : "Friend Request Accepted!"
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Internal BackEnd Server Error!"
        })
    }
})

router.post("/reject",authMiddleware,async(req,res) => {
    try{
        const {requestId} = req.body;
        const request = await friendRequest.findById(requestId);
        if(!request){
            return res.status(404).json({
                message : "No Such request Found!"
            });
        }

        if(request.receiver.toString() !== (req as any).userId){
            return res.status(403).json({
                message : "You are not Authorized for this Service!"
            });
        }

        request.status = "rejected";
        await request.save();

        return res.status(200).json({
            message : "Friend request rejected!"
        })
    }
    catch(error){
        return res.status(500).json({
            message : "BackEnd Error or Server Crashed"
        })
    }
})

// User.findById(user).populate("friends", "username uniqueId") first finds the user document whose _id matches user. The populate("friends") call tells Mongoose to replace the ObjectIds stored in the friends array with the actual User documents they reference. The second argument ("username uniqueId") acts as a field selector, so only those two fields are included in the populated friend objects, avoiding unnecessary data such as passwords or email addresses. This makes it easy for the frontend to display meaningful friend information instead of raw database IDs.

router.get("/friendList",authMiddleware,async(req,res) => {
    try{
        const user = (req as any).userId;
        const findUser = await User.findById(user).populate("friends","username uniqueId");
        if(!findUser){
            return res.status(404).json({
                message : "User doesnot exist!"
            });
        }
        return res.status(200).json({
            message : "Your Friends are as followed!",
            friends :  findUser.friends
        })
    }
    catch(error){
        return res.status(500).json({
            message : "BackEnd Error or Server Crashed!"
        })
    }
})


router.post("/remove",authMiddleware,async(req,res) => {
    try{
        const userid = (req as any).userId;
        const {friendId} = req.body;
        await User.findByIdAndUpdate(userid,{
            $pull:{
                friends : friendId,
            }
        });
        await User.findByIdAndUpdate(friendId,{
            $pull:{
                friends : userid,
            }
        });
        return res.status(200).json({
            message : "Friends removed Successfully!"
        });
    }
    catch(error){
        return res.status(500).json({
            message : "BackEnd Error or Server Crashed!"
        });
    }
})

router.post("/open", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({
        message: "friendId is required",
      });
    }
    if (userId === friendId) {
      return res.status(400).json({
        message: "You cannot create a conversation with yourself",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({
        message: "Friend not found",
      });
    }

    const isFriend = user.friends.some(
      (id: any) => id.toString() === friendId
    );

    if (!isFriend) {
      return res.status(403).json({
        message: "You can only chat with users in your friends list",
      });
    }
    const existingConversation = await conversation.findOne({
      participants: {
        $all: [userId, friendId],
      },
    });

    if (existingConversation) {
      return res.status(200).json({
        conversation: existingConversation,
      });
    }
    const newConversation = await conversation.create({
      participants: [userId, friendId],
    });

    return res.status(201).json({
      conversation: newConversation,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Backend Error or Server Crashed!",
    });
  }
})
export default router;