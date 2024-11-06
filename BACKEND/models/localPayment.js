const mongoose = require('mongoose');
/*
Adrian was responsible for all payment systems. As seen on github repo (GitOutOfHere branch)
*/
// Local transfer schema
const transferLocalSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Allowing letters and spaces only
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: props => `${props.value} is not a valid recipient name!`
    }
  },
  recipientBank: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow letters, numbers, and spaces for bank name
        return /^[a-zA-Z0-9\s]+$/.test(v);
      },
      message: props => `${props.value} is not a valid bank name!`
    }
  },
  recipientAccNo: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Account number can only be numeric and between 10-12 digits
        return /^\d{10,12}$/.test(v);
      },
      message: props => `${props.value} is not a valid account number!`
    }
  },
  transferAmount: {
    type: Number,  // Changed to Number for better handling of amounts, as mentioned in intlPayment.js @ST10036066, please review for backend amendment
    required: true,
    validate: {
      validator: function(v) {
        // Amount has to be a positive number with up to two decimal places
        return /^\d+(\.\d{1,2})?$/.test(v);
      },
      message: props => `${props.value} is not a valid transfer amount!`
    }
  },
  swiftCode: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // SWIFT code
        return /^[A-Za-z0-9]{8,11}$/.test(v);
      },
      message: props => `${props.value} is not a valid SWIFT code!`
    }
  }
});

// @ST10036066 please review! Hopefully doesn't break anything, but seems more concise
const LocalPayment = mongoose.model('localPayment', transferLocalSchema);
module.exports = LocalPayment;
