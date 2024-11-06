const mongoose = require('mongoose')

// // MongoDB connection using the environment variable
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.log('MongoDB connection error: ', err));

// User model. At this point, the user is the customer 
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
  balance: {
    type: Number,
    default: 5000  // as a user registers, the default balace is R5000. 
    //the default money can be deducted or added
  }
});
//module.exports=moongoose.model('User', userschema)
mongoose.models=mongoose.model('User', userschema)
const User = mongoose.model('User', userSchema);
