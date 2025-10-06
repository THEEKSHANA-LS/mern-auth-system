import React, { useContext } from "react";
import { HiArrowSmRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { toast } from "react-toastify";
import axios from "axios";

const NavBar = () => {
 
  const navigate = useNavigate();
  const {userData, backendUrl, setUserData, setIsLoggedIn} = useContext(AppContext);

  const sendVerificationOtp = async()=>{
    try{
      axios.defaults.withCredentials = true;
  
      const {data} = await axios.post(backendUrl + "/api/auth/send-verify-otp");

      if(data.success){
        navigate("/email-verify");
        toast.success(data.message);
      } else{
        toast.error(error.messsage);
      }

    } catch(error){
      toast.error(error.message);
    }
  }

  const logout = async()=>{
    try{
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendUrl + "/api/auth/logout");
        data.success && setIsLoggedIn(false);
        data.success && setUserData(false);
        navigate("/")
    } catch(error){
        toast.error(error.message);
    }
  }

  return (
    <div className="w-full h-full flex flex-row items-center justify-between px-[40px]">
      <div className="flex flex-row items-center">
         <img src="logo.png" className="w-[50px] h-[50px] m-[20px] cursor-pointer"/>
         <h1 className="text-2xl font-bold text-black cursor-pointer">MERN auth</h1>
      </div>
      {userData ? 
        <div className="rounded-full w-[40px] h-[40px] bg-black text-white font-semibold flex cursor-pointer items-center justify-center relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-xs">
              {!userData.isAccountVerified && 
                 <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify Email</li>
              }
              <li onClick={logout} className="py-1 px-2 pr-10 hover:bg-gray-200 cursor-pointer">Logout</li>
            </ul>
          </div>
        </div>

        : <div className="relative right-8 flex gap-[30px]">
             <button 
                onClick={()=> navigate("/login")}
                className="border border-gray-300 shadow-lg rounded-full px-[12px] py-[4px]  hover:bg-gradient-to-r from-purple-800 to-pink-500 transition-all flex flex-row items-center gap-[5px] font-bold">Login <HiArrowSmRight className="font-bold"/>
             </button>
        </div>
      }
      
    </div>
  )
}

export default NavBar;



