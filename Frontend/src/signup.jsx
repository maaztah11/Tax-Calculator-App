import React from 'react';
import { useState } from 'react';


const Signup = ({ setSignup }) => {
    const [ username , setUsername ] = useState('');
    const [ password, setPassword] = useState('');
    
        const handleSignup = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://127.0.0.1:3000/signup/',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username, password:password })
                
            });
            if(response.ok){
                const data = await response.json();
                console.log('Response Data: ',data);
                setSignup(true);
            }
            else{
                console.log("An error occured");
            }

        }
        catch(error){
            console.log('Error', error);
        }
    }
    return (        
    <div className="signup-container">
        <form className="signup-form" onSubmit={handleSignup}>
            <h2>Signup</h2>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" placeholder="Enter your username" />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input value={password} onChange={ (e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Enter your password" />
            </div>
            <button type="submit" className="submit-btn">Signup</button>
        </form>
    </div>
    );
}
export default Signup;