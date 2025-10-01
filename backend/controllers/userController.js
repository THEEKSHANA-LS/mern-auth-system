//in here we create API end point controller funnctions in here...
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

//post api request function setup...(sign-up) 
export const register =  async(req, res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({
            success: false, 
            message : "Missing Details."
        });
    }

    try{

        const existingUser = await userModel.findOne({email})
         
        if(existingUser){
            return res.json({
                success : false, 
                message : "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({name, email, password:hashedPassword});
        await user.save(); //store user in database...

        //generate confirm authentication...(generate token using the cookies)
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn : "7d" });

        res.cookie("token", token, {
            httpOnly : true, //only http requests can access these cookie... 
            secure : process.env.NODE_ENV === "production", //in development environment don't secure, production environment must secure...
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict", //in development environment both frontend & backend run localhost, the production environment their run different servers...
            maxAge : 7 * 24 * 60 * 60 * 1000 //we shoud convert into miliseconds...the cookie expires in 7 days...
        });

        //sending welcome email...
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject : "Welcome to MERN Stack Project.",
            text : "welcome to MERN stack website. Your account has been created with email id: " + email,
        }

        await transporter.sendMail(mailOptions);

        return res.json({
            success : true,
        });

    } catch(error){
         return res.json({success: false, message : error.message})
    }
}

//post api request function setup..(login)
export const login = async(req, res)=>{
    const { email, password } = req.body;

    if(!email || !password){
        return res.json({
            success : false,
            message : "email and password are required."
        })
    }

    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({
                success : false,
                message : "Invalid email."
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({
                success : false,
                message : "Invalid password."
            })
        }
        
        //generate confirm authentication...(generate token using the cookies)
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn : "7d" });

        res.cookie("token", token, {
            httpOnly : true, //only http requests can access these cookie... 
            secure : process.env.NODE_ENV === "production", //in development environment don't secure, production environment must secure...
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict", //in development environment both frontend & backend run localhost, the production environment their run different servers...
            maxAge : 7 * 24 * 60 * 60 * 1000 //we shoud convert into miliseconds...the cookie expires in 7 days...
        });
        
        return res.json({
            success : true,
        });

    }catch(error){
        return res.json({
            success : false,
            message : error.message
        })
    }
}

//logout api request function setup...
export const logout = async(req, res)=>{
    try{
        res.clearCookie("token", {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV ==="production" ? "none" : "strict",
        })

        return res.json({
            success : true,
            message : "Logged Out."
        })

    }catch{
        return res.json({
            success : false,
            message : error.message
        });
    }
}

//user email verification function...
