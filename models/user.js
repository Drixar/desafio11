import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    displayName: {
        type:String,
        required: true
    },
    username: {
        type:String,
        // required: true
    },
    email:{
        type:String,
        required: true
    },
    age:{
        type:Number,
        // required: true
    },
    password:{
        type:String,
        // required:true
    },
    role:{
        type:String,
        // required:true
    }
});

mongoose.set('strictQuery', false)

const UserModel = mongoose.model(usersCollection, userSchema);

export default UserModel