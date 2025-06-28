const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
