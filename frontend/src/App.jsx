import React from 'react'
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import EmailVerifyPage from './pages/emailVerifyPage';
import ResetPasswordPage from './pages/resetPasswordPage';
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/email-verify" element={<EmailVerifyPage/>}/>
        <Route path="/reset-password" element={<ResetPasswordPage/>}/>
      </Routes>
    </div>
  )
}

export default App;
