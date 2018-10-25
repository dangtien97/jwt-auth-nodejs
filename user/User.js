const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const id = new Date().getTime() + Math.random().toString(36).substr(2, 9);
const formatedDate = new Date();
formatedDate.setHours( formatedDate.getHours() + 7);

const userSchema = new mongoose.Schema({
  userID: {
    type: Number,
    required: true,
    unique: true,
    default: id
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: formatedDate
  },
});

const User = mongoose.model('User', userSchema);

autoIncrement.initialize(mongoose.connection); //if have not userID in request, add a new userID and auto increment
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'userID'
});

module.exports = User;