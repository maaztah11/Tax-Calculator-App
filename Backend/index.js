const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();


app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.port;
const db = new sqlite3.Database('./user-authentication', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
      } else {
        console.log('Connected to the SQLite database.');
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `;
        db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Failed to create table:', err.message);
            } else {
                console.log('Table "users" is ready.');
            }
        });
      }
});
app.post('/login/', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    try {
        // Query the database for the user
        const query = 'SELECT * FROM users WHERE username = ?'; // Use `?` for SQLite
        db.get(query, [username], async (err, user) => {
            if (err) {
                console.error('Failed to query the database:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign(
                { id: user.id, username: user.username },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            res.json({ token });
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/signup/', async (req,res) => {
    const { username,password } = req.body;
    console.log("username: ", username);
    console.log('Password: ', password);
    if(!username){
        return res.status(400).json({error: "Username is required"})
    }
    if(!password){
        return res.status(400).json({error: "Password is required"})
    }
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users(username, password) VALUES (?, ?)';
        db.run(query, [username, hashedPassword], function(err){
            if (err) {
                if (err.message.includes('UNIQUE')) {
                  return res.status(400).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: 'Failed to create user' });
              }
              res.status(201).json({ message: 'User created successfully', username:username});
        });
}
catch(error){
    console.error('Error during signup:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
}
})

app.post('/tax-calculator/', (req, res) => {
    const { monthlySalary } = req.body;

    if (!monthlySalary || monthlySalary <= 0) {
        return res.status(400).json({ error: "Invalid salary input." });
    }

    const annualSalary = monthlySalary * 12;
    let annualTax = 0;
    let monthlyTax = 0;
    let monthlyTakeHome = 0;

    if (annualSalary <= 600000) {
        annualTax = 0;
        monthlyTax = annualTax / 12; // No tax
        monthlyTakeHome = monthlySalary - monthlyTax;
    } else if (annualSalary <= 1200000) {
        annualTax = (annualSalary - 600000) * 0.05; // 5% for amount exceeding Rs. 600,000
        monthlyTax = annualTax / 12;
        monthlyTakeHome = monthlySalary - monthlyTax;
    } else if (annualSalary <= 2200000) {
        annualTax = 30000 + (annualSalary - 1200000) * 0.15; // Rs. 30,000 + 15% for amount exceeding Rs. 1,200,000
        monthlyTax = annualTax /12;
        monthlyTakeHome = monthlySalary - monthlyTax;
    } else if (annualSalary <= 3200000) {
        annualTax = 180000 + (annualSalary - 2200000) * 0.25; // Rs. 180,000 + 25% for amount exceeding Rs. 2,200,000
        monthlyTax = annualTax /12;
        monthlyTakeHome = monthlySalary - monthlyTax;
    } else if (annualSalary <= 4100000) {
        annualTax = 430000 + (annualSalary - 3200000) * 0.30; // Rs. 430,000 + 30% for amount exceeding Rs. 3,200,000
        monthlyTax = annualTax /12;
        monthlyTakeHome = monthlySalary - monthlyTax;
    } else {
        annualTax = 700000 + (annualSalary - 4100000) * 0.35; // Rs. 700,000 + 35% for amount exceeding Rs. 4,100,000
        monthlyTax = annualTax /12;
        monthlyTakeHome = monthlySalary - monthlyTax;
    }

    res.json({
        annualSalary,
        annualTax,
        monthlyTax,
        monthlyTakeHome
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});