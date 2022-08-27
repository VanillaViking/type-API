const mongoose = require('mongoose');
//mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let userSchema = new mongoose.Schema({
  discordId: String,
  totalTp: Number,
});

const User = mongoose.model('User', userSchema);

module.exports = User
