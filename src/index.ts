import express  from "express";
import authRouter from "./routes/auth"
import roomRouter from "./routes/room"
import { ConnectDB } from "./db/db";
import { configDotenv } from "dotenv";
import cors from "cors";
configDotenv();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth",authRouter);
app.use("/room",roomRouter);


async function StartServer(){
    try{
        await ConnectDB();
        app.listen(3000,() => {
            console.log("Server running on port 3000")
        })      
    }
    catch(error){
        console.log("DB error Occured!")
    }
}
StartServer();