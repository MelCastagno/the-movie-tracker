// models/user.js

const mongoose = require('mongoose');
const passportLocalMoongose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userIMG: {
    filename: String,
    url: {
      type: String,
      default: '/img/logo.png'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.']
  },
  lists: [{
    listName: String,
    movies: [{
      movieId: String,
      added: {
        type: Date,
        default: Date.now,
        require: true
        },
        review: String,
        score: Number
      }]
    }]  
})


UserSchema.plugin(passportLocalMoongose);

module.exports = mongoose.model("User", UserSchema);



