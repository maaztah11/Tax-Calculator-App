import React from 'react';
import { useState } from 'react';


const Login = () => {
    const [ loginusername , setLoginusername] = useState('');
    const [ loginPassword, setLoginpassword ] = useState('');
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
             const response = await fetch('http://127.0.0.1:3000/login/',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: loginusername, password: loginPassword})
             });
             if(response.ok){
                console.log("Promise was resolved");
                const data = await response.json();
                console.log("Data: ",data);
             }
             else{
                console.log("Promise wasnt resolved successfully");
             }
        }
        catch(error){
            console.log("Error: ", error);
        }
    }
    return(
        <div className="signup-container">
        <form className="signup-form" onSubmit={handleLogin}>
            <h2>Signup</h2>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input value={loginusername} onChange={(e) => setLoginusername(e.target.value)} type="text" id="username" name="username" placeholder="Enter your username" />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input value={loginPassword} onChange={ (e) => setLoginpassword(e.target.value)} type="password" id="password" name="password" placeholder="Enter your password" />
            </div>
            <button type="submit" className="submit-btn">Login</button>
        </form>
    </div>
    );
}
export default Login;