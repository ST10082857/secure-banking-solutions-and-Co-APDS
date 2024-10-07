const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection. edit the string or find a better way
mongoose.connect('mongodb+srv://AzaniaVC:<db_password>@cluster0.sokkbtw.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
// User model
const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    passportId: {
      type: Number,
      required: true,
      unique: true
    },
    accNo: {
      type: Number,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    confirmPass: {
      type: String,
      required: true
    }
  });
  
  const User = mongoose.model('User', userSchema);
  
  // Example route
  app.post('/users', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
 
// Register route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).send('User registered successfully');
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, 'YOUR_SECRET_KEY');
  res.json({ token });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
