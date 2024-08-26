import mongoose from "mongoose";
import ApiError from "../utils/apiError.utils.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const userSchema= new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true

    },
    address:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true

    },
    gender:{
        type:String,
        required:true},
    accessToken:{
        type:String,

    },refreshAccessToken:{
        type:String,

    },
    visitedMuseum:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Museum"
    }]
},{timestamps:true})
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10)
    next();
})
userSchema.methods.isPasswordCorrect=async function(password) {
    if(!password){
        throw new ApiError(400,"Password is not provided")
    }
    return await  bcrypt.compare(password,this.password);

}
userSchema.methods.generateAccessToken=function() {
    return jwt.sign({_id:this._id,userName:this.userName},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.generateRefreshAccessToken=function(){
    return jwt.sign({
        _id:this._id
    },process.env.REFRESH_ACCESS_TOKEN_SECRET,{expiresIn:process.env.REFRESH_ACCESS_TOKEN_EXPIRY});
    }
    





export const User= mongoose.model("User",userSchema);