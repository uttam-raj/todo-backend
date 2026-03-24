const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema =new mongoose.Schema({

    name:{
        type: String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileImage: { type: String },
    gender:{
        type:String,
        enum:["male","female","other"],
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    otp:{
        type:String,
    },
    otpExpirationTime:{
        type:Date,
    }

},{timestamps:true})
userSchema.pre("save",async function (next){  //It is mongoose pre-save middleware which is run before saving a user in the db. 
    const user = this;  //this refers to the document being saved, so user here is the user instance.
    if(!user.isModified("password")){
       return next();                     //You must call next() to proceed to the next middleware or complete the save.
    }
    try{
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password,saltRound);
        user.password= hash_password;

    }catch(error){
         next(error);
    }
});

userSchema.methods.generateToken = async function(){   //Instance method:- It is available for every document or user can call it.
    try{
        const token= jwt.sign(
            {                                   //This is the payload part (here this refer to current  user or document)        
            userId: this._id.toString(),            
            email: this.email,
            isVerified: this.isVerified,
        },
                process.env.JWT_SECRET,         //It is  used to sign or later verify the token,If not match then token is invalid
                { expiresIn: "1h" }             //It is expiration time of token it is optional
    );
    return token;


    }catch(error){
        console.error("Token generator error:",error);
    }
}

//User;-This is the name of the module. It will be used to interact with the MongoDB collection.
//userSchema:-Schema/blueprint of the mongoDB document that how it will store in the database. 
const User = mongoose.model("User",userSchema); 
module.exports=User;