const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const id = new Date().getTime() + Math.random().toString(36).substr(2, 9);
const formatedDate = new Date();
formatedDate.setHours( formatedDate.getHours() + 7);

const tokenSchema = new mongoose.Schema({
  tokenID: {
    type: String,
    required: true,
    unique: true,
    default: id
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  created: {
    type: Date,
    default: formatedDate
  },
});

const Token = mongoose.model('Token', tokenSchema);

autoIncrement.initialize(mongoose.connection); //if have not tokenID in request, add a new tokenID and auto increment
tokenSchema.plugin(autoIncrement.plugin, {
    model: 'Token',
    field: 'tokenID'
});

module.exports = Token;