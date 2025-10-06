import React from 'react'
import NavBar from '../components/navBar.jsx';
import Header from '../components/header.jsx';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-300 overflow-y-scroll">
      <NavBar/>
      <Header/>
    </div>
  )
}

export default HomePage;
