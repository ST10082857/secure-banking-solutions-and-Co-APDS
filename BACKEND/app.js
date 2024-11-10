const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory "database" for demonstration purposes
const users = [];

// Endpoint to register a new user (hashes and stores password)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: "Username and password are required" });
    }

    try {
        const saltRounds = parseInt(process.env.BRCYPT_SALT_ROUNDS, 10);
        const hashedPassword = await bcrypt.hash(password, 10); // Hash and salt the password
        const user = { username, password: hashedPassword };
        users.push(user); // Store user in our "database"
        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Internal server error"); 
    }
});

// Endpoint to log in rate limit
const loginLimiter = rateLimit({
    window: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 loign request per windows
    message: "Too many login attemots from this IP, please try again after 15 minutes"
});

// Endpoint to log in (verifies the password)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).send("User not found");
    }

    try {
        const isMatch = await bcrypt.compare(password, user.password); // Verify password
        if (isMatch) {
            res.send("Login successful");
        } else {
            res.status(400).send("Incorrect password");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Internal server error");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
