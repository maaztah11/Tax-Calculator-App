import React, { useState } from 'react';
import './tax-cal.css'


const Taxcal = () => { 
    const [ monthlySalary, setMonthlySalary ] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState({
        annualSalary: '',
        annualTax: '',
        monthlyTax: '',
        monthlyTakeHome: ''
    })
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          const response = await fetch('http://127.0.0.1:3000/tax-calculator/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ monthlySalary: monthlySalary })  // Correct parameter name
          });
      
          if (response.ok) {
            const data = await response.json();
            setResult({
              annualSalary: data.annualSalary,
              annualTax: data.annualTax,
              monthlyTax: data.monthlyTax,
              monthlyTakeHome: data.monthlyTakeHome
            });
            setShowResult(true);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch tax data');
          }
        } catch (error) {
          console.error('Error:', error);  // Set the error message to display in UI
        }
      };
    return(
<div className="container">
            <div className="form-container">
                <h2>Fill the input given below.</h2>
                <h3 id="username-id">Hi</h3>
                <form id="tax-form" onSubmit={handleSubmit}>
                    <label htmlFor="monthly-salary">Enter your Monthly Salary:</label>
                    <input
                        type="number"
                        id="monthly-salary"
                        name="monthly-salary"
                        value={monthlySalary}
                        onChange={(e) => setMonthlySalary(e.target.value)}
                        placeholder="Enter your monthly Salary in RS:"
                    />
                    <button type="submit">Calculate Tax</button>
                </form>

                <div id="result"  style={{ display: showResult ? 'block' : 'none' }}>
                    <p id="annual-salary">Annual Salary: {result.annualSalary}</p>
                    <p id="annual-tax">Annual tax: {result.annualTax}</p>
                    <p id="monthly-tax">Monthly tax: {result.monthlyTax}</p>
                    <p id="monthly-takehome">Monthly Takehome: {result.monthlyTakeHome}</p>
                </div>
            </div>
        </div>
    );

}
export default Taxcal