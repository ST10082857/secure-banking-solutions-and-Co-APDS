const express = require('express');  
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');  // Load dotenv
const bcrypt = require('bcryptjs');  // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jwt for token generation
const mongoose = require('mongoose'); // Import mongoose for MongoDB connection
const fs = require('fs');
const https = require('https');
const http = require('http'); // Import http for redirecting
const User = require('./models/user'); // Ensure this path is correct
const dotenv = require('dotenv');  // Load dotenv

/*
mushfeeq + adrian responsiblity: 
*/

dotenv.config();  // Initialize dotenv
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Serve a simple response for HTTPS
app.get('/', (req, res) => {
  res.send('Hello! This connection is secured with HTTPS.');
});

// SSL options
const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

// Create HTTPS server
https.createServer(sslOptions, app).listen(443, () => {
  console.log('HTTPS server is running on https://localhost');
});

// Redirect HTTP to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80, () => {
  console.log('HTTP server is running and redirecting to HTTPS');
});

// Register route
app.post('/api/register', async (req, res) => {
  const { fullName, passportId, accNo, password, confirmPassword } = req.body;

  // Input validation
  if (!fullName || !passportId || !accNo || !password || !confirmPassword) {
    return res.status(400).send('All fields are required.');
  }
  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match.');
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using the User model
    const newUser = new User({
      fullName,
      passportId,
      accNo,
      password: hashedPassword
    });
    
    // Save the new user to MongoDB
    await newUser.save();

    // Send success response
    res.status(201).send('User registered successfully');
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) { 
      return res.status(400).send('Passport ID or Account Number already exists.');
    }
    res.status(400).send('Error registering user: ' + error.message);
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { passportId, password } = req.body;
  const user = await User.findOne({ passportId }); // Use passportId for login

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Using environment variable for secret key
  res.json({ token });
});

// Start server
const port = process.env.PORT || 3000; //default
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

