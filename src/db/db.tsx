import mongoose from "mongoose";

export async function ConnectDB(){
    await mongoose.connect(process.env.MONGO_URL!);
//     /*
// Why use the "!" operator with process.env.MONGO_URL?

// In TypeScript, environment variables are typed as
// string | undefined because TypeScript cannot guarantee
// that a variable exists in the .env file.

// However, mongoose.connect() expects a value of type string.

// By writing:

//     process.env.MONGO_URL!

// the non-null assertion operator (!) tells TypeScript:

//     "I am sure this value exists and is not undefined."

// This removes the type error and allows the value to be
// passed to mongoose.connect().

// The "!" should only be used when the environment variable
// is guaranteed to exist, typically after loading the .env
// file using dotenv.config().
// */
}

const userSchema = new mongoose.Schema({
    uniqueId : {
        type : String,
        required : true,
        unique : true
    },
    email:{
        type: String,
        required : true,
        unique : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        requird : true
    }
});

const roomSchema = new mongoose.Schema({
    roomId : String,
    createdBy : String
})

export const User = mongoose.model("User",userSchema);
export const room = mongoose.model("room",roomSchema);