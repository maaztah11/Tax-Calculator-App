import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './navbar';
import './App.css'
import Taxcal from './tax-cal'
import Signup from './signup';
import Login from './Login';
function App() {
const [isSignedup , setSignup] = useState(false);

  return (
    <Router>
    <Navbar  isSignedup={isSignedup} />
    <Routes>
        <Route path="/home" element={<Taxcal />} />
        <Route path="/signup" element={<Signup setSignup={setSignup} />} />
        <Route path="/login" element={<Login/>} />

    </Routes>
</Router>
  )
}

export default App
