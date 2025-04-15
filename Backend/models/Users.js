const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // This will now be stored as plain text
  contact: { type: String, required: true },
  address: { type: String, required: true },
  role:{type:String,default:"user"}
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
