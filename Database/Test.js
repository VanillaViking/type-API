const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let testSchema = new mongoose.Schema({
  discordId: String,
  wpm: Number, 
  accuracy: Number,
  date: Date, 
  promptId: String,
  tp: Number
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test
