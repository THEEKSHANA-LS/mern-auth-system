import React, { useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import {AppContext} from "../context/appContext.jsx";
import axios from "axios";
import {useContext} from "react";
import { toast } from 'react-toastify';

const EmailVerifyPage = () => {

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const {backendUrl, isLoggedIn, userData, getUserData} = useContext(AppContext)
  
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

    const onSubmitHandler = async(e) =>{
      try{
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value);
        const otp = otpArray.join("");

        const {data} = await axios.post(backendUrl + "/api/auth/verify-email", {otp});
        if(data.success){
          toast.success(data.message);
          getUserData();
          navigate("/");
        } else{
          toast.error(data.message);
        }
      } catch(error){
        toast.error(error.message);
      }
    }

    useEffect(()=>{
      isLoggedIn && userData && userData.isAccountVerified && navigate("/")
    },[isLoggedIn, userData])

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
        <form onSubmit={onSubmitHandler} className="bg-slate-950 p-8 rounded-lg shadow-lg w-96 text-sm text-center">
          <h1 className="font-bold text-2xl mb-5  text-white">Verification OTP</h1>
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
      </div>
      
      
    </div>
  )
}

export default EmailVerifyPage;
