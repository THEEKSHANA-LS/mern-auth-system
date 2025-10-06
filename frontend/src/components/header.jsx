import React, { useContext } from 'react'
import { AppContext } from '../context/appContext';

const Header = () => {

  const {userData} = useContext(AppContext);

  return (
    <div className="w-full flex flex-col items-center justify-center px-[40px]">
      <div className="items-center justify-center">
        <img src="header.png" className="w-75"/>
      </div>
      <div className="w-full flex flex-col gap-3 justify-center items-center">
        <h1 className="text-2xl font-semibold">Hi {userData ? userData.name : "Developer"}👋</h1>
        <h2 className="font-bold text-3xl">Welcome to our App</h2>
        <p className="font-medium mb-8">Let's start with a quick product tour and we will have you up and running in no time !</p>
        <button className="border border-gray-300 shadow-lg hover:bg-gradient-to-r from-purple-800 to-pink-500 font-bold rounded-full px-[20px] py-[5px]">Let's Start</button>
      </div>
    </div>
  )
}

export default Header;
