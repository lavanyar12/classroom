const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  accountType:{
    type: String,
    required: true
  },
  studentSubject:{
    type: String,
    required: false
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
