//in here we create API end point controller funnctions in here...
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";

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

//user email verification function...for send verification OTP to user's email...
export const sendVerifyOtp = async (req, res) => {
    try {
      const userId = req.userId; // ✅ get from middleware
      if (!userId) {
        return res.json({ success: false, message: "User not authenticated." });
      }
  
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.json({ success: false, message: "User not found." });
      }
  
      if (user.isAccountVerified) {
        return res.json({ success: false, message: "Account already verified." });
      }
  
      // Generate OTP
      const otp = String(Math.floor(100000 + Math.random() * 900000));
  
      user.verifyOtp = otp;
      user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
      await user.save();
  
      // Send email
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Account Verification OTP",
        text: `Your OTP is ${otp}. Verify your account using this OTP.`,
        html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ success: true, message: "Verification OTP sent to email." });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };

//user OTP verification function...(verify the email using OTP)
export const verifyEmail = async (req, res) => {
    try {
      const userId = req.userId; // ✅ get from middleware
      const { otp } = req.body;
  
      if (!userId || !otp) {
        return res.json({ success: false, message: "Missing details." });
      }
  
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.json({ success: false, message: "User not found." });
      }
  
      if (!user.verifyOtp || user.verifyOtp !== otp) {
        return res.json({ success: false, message: "Invalid OTP." });
      }
  
      if (user.verifyOtpExpireAt < Date.now()) {
        return res.json({ success: false, message: "OTP expired." });
      }
   
      user.isAccountVerified = true;
      user.verifyOtp = "";
      user.verifyOtpExpireAt = 0;
  
      await user.save();
  
      res.json({ success: true, message: "Email verified successfully." });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };

//check the user is authenticated or not...
export const isAuthenticated = async(req, res)=>{
    try{
        return res.json({
            success: true
        });
    } catch(error){
        res.json({
            success : false,
            message : error.message
        });
    }
};

//send password reset otp...
export const sendResetOtp = async(req, res)=>{
    const {email} = req.body;

    if(!email){
        return res.json({
            success : false,
            message : "Email is required."
        })
    }

    try{

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success : false,
                message : "User not found"
            });
        }

         // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
  
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 24 hours
  
        await user.save();
  
        // Send email
        const mailOptions = {
           from: process.env.SENDER_EMAIL,
           to: user.email,
           subject: "Reset Password OTP",
           text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting you password.`,
           html : PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)
        };
  
        await transporter.sendMail(mailOptions);
  
        res.json({ success: true, message: "OTP sent to your email." });

    } catch(error){
        return res.json({
            success : "false",
            message : error.message 
        })
    }
};

//Reset User Password...
export const resetPassword = async(req, res)=>{
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({
            success : false,
            message : "Email, OTP and new password are required."
        });
    }

    try{
        
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success : false,
                message : "User not found"
            });
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({
                success : false,
                message : "Invalid OTP"
            });
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({
                success : false,
                message : "OTP expired."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        
        await user.save();

        return res.json({
            success : true,
            message : "Password has been reset successfully"
        });

    } catch(error){
        return res.json({
            success : false,
            message : error.message
        });
    }
}
  