import React, { use, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TbLockPassword } from "react-icons/tb";
import { HiOutlineMail } from "react-icons/hi";
import { AppContext } from '../context/appContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {

  const {backendUrl} = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);


  const inputRefs = React.useRef([]);

  const handleInput = (e, index)=>{
    if(e.target.value.length > 0 && index < inputRefs.current.length -1)
     inputRefs.current[index + 1].focus();
 }

 const handleKeyDown = (e, index)=>{
   if(e.key === "Backspace" && e.target.value === "" && index > 0){
     inputRefs.current[index - 1].focus();
   }
 }

 const handlePaste = (e)=>{
   const paste = e.clipboardData.getData("text")
   const pasteArray = paste.split("");
   pasteArray.forEach((char, index)=>{
     if(inputRefs.current[index]){
       inputRefs.current[index].value = char;
     }
   })
 }


 //handler functions...
 const onSubmitEmail = async(e)=>{
  e.preventDefault();
  try{
    const {data} = await axios.post(backendUrl + "/api/auth/send-reset-otp", {email})
    data.success ? toast.success(data.message) : toast.error(data.message);
    data.success && setIsEmailSent(true);
  } catch(error){
    toast.error(error.message);
  }
 }

 const onSubmitOtp = async(e)=>{
  e.preventDefault();
  const otpArray = inputRefs.current.map(e => e.value)
  setOtp(otpArray.join(""))
  setIsOtpSubmitted(true)
 }

 const onSubmitNewPassword = async(e)=>{
  e.preventDefault();
  try{
    const {data} = await axios.post(backendUrl + "/api/auth/reset-password", {email, otp, newPassword});
    data.success ? toast.success(data.message) : toast.error(data.message);
    data.success && navigate("/login");
  } catch(error){
    toast.error(error.message);
  } 
 }

  return (
    <div className="w-full h-screen px-[40px] bg-gradient-to-b from-purple-900 to-pink-300 gap-[10px]">
      <div className="flex flex-row items-center">
        <img
          onClick={() => navigate("/")}
          src="logo.png"
          className="w-[50px] h-[50px] m-[20px] cursor-pointer"
        />
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-black cursor-pointer"
        >
          MERN Auth
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center mt-[140px]">

        {/* enter registered email */}

        {!isEmailSent && 

        <form onSubmit={onSubmitEmail} className="bg-slate-950 p-8 rounded-lg shadow-lg w-96 text-sm text-center">
          <h1 className="font-bold text-2xl mb-5  text-white">Reset Password</h1>
          <p className="font-semibold text-xs text-indigo-300">Enter your registered email address.</p>
          <div className="flex flex-row items-center gap-3 w-full mb-4 px-5 py-2.5 rounded-full bg-[#333A5C] mt-6">
             <HiOutlineMail/>
             <input 
               type="text" 
               placeholder="Enter your email" 
               value={email} 
               onChange={e => setEmail(e.target.value)} 
               required 
               className="bg-transparent outline-none text-white" 
             />
          </div>
          <button className="w-full shadow-lg cursor-pointer px-[2px] py-[10px] font-bold bg-gradient-to-r from-purple-900 to-pink-300 rounded-full mt-1">
            Submit
          </button>
        </form>

        }

        {/* enter verify otp */}

        {!isOtpSubmitted && isEmailSent &&

        <form onSubmit={onSubmitOtp} className="bg-slate-950 p-8 rounded-lg shadow-lg w-96 text-sm text-center">
          <h1 className="font-bold text-2xl mb-5  text-white">Reset Password OTP</h1>
          <p className="font-semibold text-xs text-indigo-300">Enter the 6-digit code sent to your email.</p>
          <div className="flex justify-between mt-6" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index)=>(
              <input 
                 type="text" 
                 maxLength="1" 
                 key={index} 
                 required 
                 className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                 ref = {e => inputRefs.current[index] = e}
                 onInput={(e) => handleInput(e, index)}
                 onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button className="w-full shadow-lg cursor-pointer px-[2px] py-[10px] font-bold bg-gradient-to-r from-purple-900 to-pink-300 rounded-full mt-5">
            Verify Email
          </button>
        </form>

        }

        {/* enter new password */}

        {isOtpSubmitted && isEmailSent &&

        <form onSubmit={onSubmitNewPassword} className="bg-slate-950 p-8 rounded-lg shadow-lg w-96 text-sm text-center">
          <h1 className="font-bold text-2xl mb-5  text-white">Reset Password</h1>
          <p className="font-semibold text-xs text-indigo-300">Enter your new password.</p>
          <div className="flex flex-row items-center gap-3 w-full mb-4 px-5 py-2.5 rounded-full bg-[#333A5C] mt-6">
             <TbLockPassword/>
             <input 
               type="password" 
               placeholder="Enter new Password" 
               value={newPassword} 
               onChange={e => setNewPassword(e.target.value)} 
               required 
               className="bg-transparent outline-none text-white" 
             />
          </div>
          <button className="w-full shadow-lg cursor-pointer px-[2px] py-[10px] font-bold bg-gradient-to-r from-purple-900 to-pink-300 rounded-full mt-1">
            Reset Password
          </button>
        </form>
        
        }
      </div>
    </div>
  )
}

export default ResetPasswordPage;
