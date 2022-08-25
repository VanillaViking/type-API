const mongoose = require('mongoose');
//mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let userSchema = new mongoose.Schema({
  discordId: String,
  totalTp: Number,
  totalTests: Number,
  bestWpm: Number
});

const User = mongoose.model('User', testSchema);

module.exports = User
