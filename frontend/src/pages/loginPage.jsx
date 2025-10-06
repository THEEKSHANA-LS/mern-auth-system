import React, { useContext, useState } from 'react';
import { MdOutlinePerson } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appContext';
import { toast } from 'react-toastify';
import axios from 'axios';  // ✅ Make sure axios is imported

const LoginPage = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // ✅ fixed typo (was setEamil)
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true; // ✅ corrected "default" → "defaults"

      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      // ✅ Fix: use error.response or error.message instead of data
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

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

      <div className="absolute left-[40%] bg-slate-950 shadow-lg w-[350px] py-[40px] rounded-2xl flex flex-col items-center mt-[30px] gap-2">
        <h1 className="text-white font-semibold text-2xl mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h1>
        <p className="text-white font-medium text-sm mb-6">
          {state === "Sign Up" ? "Create Your Account" : "Login to Your Account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="flex flex-row items-center gap-3 w-full mb-4 px-5 py-2.5 rounded-full bg-[#333A5C]">
              <MdOutlinePerson />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none text-white"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="flex flex-row items-center gap-3 w-full mb-4 px-5 py-2.5 rounded-full bg-[#333A5C]">
            <HiOutlineMail />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none text-white"
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="flex flex-row items-center gap-3 w-full mb-4 px-5 py-2.5 rounded-full bg-[#333A5C]">
            <TbLockPassword />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none text-white"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="cursor-pointer text-indigo-500"
          >
            Forgot password?
          </p>

          <button className="w-full shadow-lg cursor-pointer px-[2px] py-[10px] font-bold bg-gradient-to-r from-purple-900 to-pink-300 rounded-full mt-4">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-300 mt-3 text-xs text-center">
            Already have an Account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-indigo-500 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-300 mt-3 text-xs text-center">
            Don't have an Account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-indigo-500 cursor-pointer underline"
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
