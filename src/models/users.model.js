import mongoose,{model, Schema} from "mongoose";
import jwt from "jsonwebtoken"
import { json } from "express";
import bcrypt from "bcrypt"


const userSchema=new Schema(
    {
          username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
          },
          email:{
          type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
          },
          fullname:{
            type:String,
            required:true
          },
          coverimage:{
            type:String
          },
          watchHistory:[
            {
            type:Schema.Types.ObjectId,
            ref:"video"
            }
          ],
          password:{
            type:String,
            required:[true,'password is requjired']

          },
          refreshtoken:{
            type:String
          }


     },{
        timestamps:true
     }

    
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt(password,this.password)

}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
