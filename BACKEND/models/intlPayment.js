const mongoose = require('mongoose');

// International transfer schema
const transferIntlSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow letters and spaces only
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
        // Account number should be numeric and between 10-12 digits
        return /^\d{10,12}$/.test(v);
      },
      message: props => `${props.value} is not a valid account number!`
    }
  },
  transferAmount: {
    type: Number,  // Changed to Number for better handling of amounts @ST10036066
    required: true,
    validate: {
      validator: function(v) {
        // Amount changed to a positive number with * up to * two decimal places to account for change
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
        // SWIFT code has to be alphanumeric, and either 8 or 11 characters (Check here for more info: https://tipalti.com/mass-payments-hub/swift-code/#:~:text=The%20SWIFT%20code%20is%20an,numbers%20for%20bank's%20head%20office))
        return /^[A-Za-z0-9]{8,11}$/.test(v);
      },
      message: props => `${props.value} is not a valid SWIFT code!`
    }
  }
});

// More concise usage of mongoose.model @ST10036066 please review
const IntlPayment = mongoose.model('intlPayment', transferIntlSchema);
module.exports = IntlPayment;