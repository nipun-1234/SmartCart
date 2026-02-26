const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Home Route
app.get('/', (req, res) => {
    res.send('App listening.....');
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password, remember } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }

    console.log(`Login attempt for email: ${email}`);

    return res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        data: { email, remember } 
    });
});

// Register Route
app.post('/register', (req, res) => {
    const { email, password, remember } = req.body;  

    // Validate required fields
    if (!email || !password || remember === undefined) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email, password, and remember status are required' 
        });
    }


    console.log(`Registration attempt for email: ${email}`);
    
    return res.status(201).json({ 
        success: true, 
        message: 'Registration successful' 
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});