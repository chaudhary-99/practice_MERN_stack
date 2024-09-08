const bcrypt= require('bcrypt');
const User=require("../models/User.js");
const jwt=require("jsonwebtoken")
require("dotenv").config()
exports.signup=async(req,res)=> {
    try{
        //get data
        const {name, email, password, role} =req.body;
        //check if user already exist
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User Already Exist",
            });
        }
        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:'Error in hashing password',
            }); 

        }
        //create entry for User
        const user= await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:'User Created Sucessfully',
        }) 
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            sucess:false,
            message:'User cannot be registered, please try agin later',
        })
        

    }
}

exports.login=async(req,res)=> {
    try{
        //get data
        const {email, password} =req.body;
      // Validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details carefully",
            });
        }
        //check for registered User
        let user= await User.findOne({email});
        //if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered", 
            })
        }
        const payload={
            email:user.email,
            id:user._id,
            role:user.role,
        }
        //verify password and generate a JWT Token
        if (await bcrypt.compare(password,user.password)){
            //password match
            let token=jwt.sign(payload,
                process.env.JWT_SECRET,{
                    expiresIn:"2h",
                }
            );
            user=user.toObject(); 
            user.token=token;
            user.password=undefined;
            const options={
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,

            }
            res.cookie("token",token, options).status(200).json({
                success:true,
                token,
                user,
                message:"User Logged in successfully", 
            });
        }
        else{
            //password donot match
            return res.status(403).json({
                success:false,
                message:"Password incorrect", 
            })

        }

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            sucess:false,
            message:'Login Faliure',
        })
        

    }
}