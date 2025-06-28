const mongoose = require('mongoose');


const SelfSchema = new mongoose.Schema({
  usernameself: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  imports: {
    type: Number,
    default: 0 
  },
  exports: {
    type: Number,
    default: 0 
  },
  selfdescription: {
    type: String,
    default: 'No description available'
  },

  selfProfile :{
    type : String,
    default : ''
  }
}, { timestamps: true }); 




module.exports = mongoose.model('Self', SelfSchema);
