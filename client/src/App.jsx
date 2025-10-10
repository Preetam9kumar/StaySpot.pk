import React from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Signup from './pages/Signup.jsx';
import Signin from './pages/Signin.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';
function  App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;