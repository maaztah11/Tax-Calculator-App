import React from 'react';
import { useState } from 'react';

const Navbar = ({isSignedup }) => {
    const [isloggedin, setLogin] = useState(false);
    return(
        <div>
    <h1 style={{ color: 'black' }}>TAX-CALCULATOR APP</h1>
    <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
    <a href="/home" style={{ textDecoration: 'none', color: '#007bff' }}>Home</a>
    <a 
                href="/signup" 
                style={{
                    textDecoration: 'none', 
                    color: '#007bff', 
                    display: isSignedup ? 'none' : 'block' // Conditional display
                }}
            >
                Signup
            </a>
    <a href="/login" style={{ textDecoration: 'none', color: '#007bff' }}>Login</a>
</nav>
        </div>

);
}

export default Navbar;